<?php

namespace App\Http\Controllers;

use App\Models\IdDocument;
use App\Models\IdDocumentAccessLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class IdDocumentController extends Controller
{
    private const KINDS = [
        'tenant_id', 'tenant_proof_of_income', 'landlord_id', 'landlord_ownership_proof',
    ];

    private function log(IdDocument $doc, Request $request, string $action, ?string $notes = null): void
    {
        IdDocumentAccessLog::create([
            'document_id' => $doc->id,
            'actor_id' => $request->user()->id,
            'actor_role' => $request->user()->getRoleNames()->first() ?? 'user',
            'action' => $action,
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
            'notes' => $notes,
        ]);
    }

    private function assertReviewer(Request $request): void
    {
        if (! $request->user()->hasAnyRole(['admin', 'reviewer'])) {
            abort(403, 'Reviewer role required.');
        }
    }

    /**
     * POST /id-documents — any authenticated user uploads a document.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'kind' => ['required', Rule::in(self::KINDS)],
            'slot' => ['required', 'string', 'max:100'],
            'fileName' => ['required', 'string', 'max:255'],
            'mimeType' => ['required', 'string', 'max:100'],
            'dataBase64' => ['required', 'string'],
        ]);

        $binary = base64_decode($data['dataBase64'], true);
        if ($binary === false) {
            throw ValidationException::withMessages(['dataBase64' => 'Invalid file data.']);
        }

        $maxBytes = 8 * 1024 * 1024; // 8MB, matches frontend MAX_MB
        if (strlen($binary) > $maxBytes) {
            throw ValidationException::withMessages(['dataBase64' => 'File too large. Max 8MB.']);
        }

        $sha256 = hash('sha256', $binary);
        $extension = pathinfo($data['fileName'], PATHINFO_EXTENSION) ?: 'bin';
        $path = sprintf(
            'id-documents/%d/%s.%s',
            $request->user()->id,
            (string) Str::uuid(),
            $extension
        );

        // Private disk — configure 'id_documents' disk in config/filesystems.php
        // pointing at a non-public local path, or swap to 's3' with private ACL.
        Storage::disk(config('filesystems.id_documents_disk', 'local'))->put($path, $binary);

        $doc = IdDocument::create([
            'owner_id' => $request->user()->id,
            'kind' => $data['kind'],
            'slot' => $data['slot'],
            'disk' => config('filesystems.id_documents_disk', 'local'),
            'file_path' => $path,
            'file_name' => $data['fileName'],
            'size_bytes' => strlen($binary),
            'mime_type' => $data['mimeType'],
            'sha256' => $sha256,
            'status' => 'pending',
        ]);

        $this->log($doc, $request, 'upload');

        return response()->json([
            'id' => $doc->id,
            'fileName' => $doc->file_name,
            'size' => $doc->size_bytes,
            'mimeType' => $doc->mime_type,
            'sha256' => $doc->sha256,
        ]);
    }

    /**
     * GET /id-documents — reviewer/admin: list documents, optionally filtered by status.
     */
    public function index(Request $request)
    {
        $this->assertReviewer($request);

        $status = $request->query('status');

        $docs = IdDocument::with('owner:id,name,email')
            ->when($status && $status !== 'all', fn ($q) => $q->where('status', $status))
            ->latest()
            ->get()
            ->map(fn (IdDocument $d) => [
                'id' => $d->id,
                'owner_id' => (string) $d->owner_id,
                'owner' => $d->owner ? ['full_name' => $d->owner->name, 'email' => $d->owner->email] : null,
                'kind' => $d->kind,
                'slot' => $d->slot,
                'file_name' => $d->file_name,
                'size_bytes' => $d->size_bytes,
                'mime_type' => $d->mime_type,
                'sha256' => $d->sha256,
                'status' => $d->status,
                'review_notes' => $d->review_notes,
                'created_at' => $d->created_at->toIso8601String(),
            ]);

        return response()->json($docs);
    }

    /**
     * POST /id-documents/{id}/review — reviewer/admin: approve or reject.
     */
    public function review(Request $request, string $id)
    {
        $this->assertReviewer($request);

        $data = $request->validate([
            'decision' => ['required', Rule::in(['approved', 'rejected'])],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $doc = IdDocument::findOrFail($id);
        $doc->update([
            'status' => $data['decision'],
            'review_notes' => $data['notes'] ?? null,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $this->log($doc, $request, $data['decision'] === 'approved' ? 'review_approve' : 'review_reject', $data['notes'] ?? null);

        $doc->owner->notify(new \App\Notifications\DocumentReviewed($doc));

        return response()->json(['status' => $doc->status]);
    }

    /**
     * POST /id-documents/{id}/signed-url — owner or reviewer/admin: get a
     * short-lived signed URL to view/download the file.
     */
    public function signedUrl(Request $request, string $id)
    {
        $doc = IdDocument::findOrFail($id);

        $isOwner = $doc->owner_id === $request->user()->id;
        $isReviewer = $request->user()->hasAnyRole(['admin', 'reviewer']);
        abort_unless($isOwner || $isReviewer, 403);

        $asDownload = $request->boolean('asDownload');

        $url = Storage::disk($doc->disk)->temporaryUrl(
            $doc->file_path,
            now()->addSeconds(60),
            $asDownload ? ['ResponseContentDisposition' => 'attachment; filename="'.$doc->file_name.'"'] : []
        );

        $this->log($doc, $request, $asDownload ? 'download' : 'view');

        return response()->json(['url' => $url]);
    }

    /**
     * GET /id-documents/{id}/access-log — reviewer/admin: audit trail for one document.
     */
    public function accessLog(Request $request, string $id)
    {
        $this->assertReviewer($request);

        $entries = IdDocumentAccessLog::with('actor:id,name,email')
            ->where('document_id', $id)
            ->latest()
            ->get()
            ->map(fn (IdDocumentAccessLog $e) => [
                'id' => $e->id,
                'action' => $e->action,
                'actor_id' => (string) $e->actor_id,
                'actor_role' => $e->actor_role,
                'actor' => $e->actor ? ['full_name' => $e->actor->name, 'email' => $e->actor->email] : null,
                'ip_address' => $e->ip_address,
                'notes' => $e->notes,
                'created_at' => $e->created_at->toIso8601String(),
            ]);

        return response()->json($entries);
    }

    /**
     * GET /id-documents/my-role — current user's access role.
     */
    public function myRole(Request $request)
    {
        return response()->json(['role' => $request->user()->getRoleNames()->first() ?? 'user']);
    }
}
