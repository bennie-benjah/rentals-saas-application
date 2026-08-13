<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMaintenanceRequestRequest;
use App\Http\Requests\UpdateMaintenanceRequestRequest;
use App\Models\Lease;
use App\Models\MaintenanceRequest;
use App\Models\Unit;
use App\Notifications\MaintenanceStatusChanged;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaintenanceRequestController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $this->authorize('viewAny', MaintenanceRequest::class);

        $user = $request->user();

        $requests = MaintenanceRequest::with(['unit.property', 'tenant:id,name', 'assignee:id,name'])
            ->when($user->hasRole('landlord'), fn ($q) => $q->where('landlord_id', $user->id))
            ->when($user->hasRole('tenant'), fn ($q) => $q->where('tenant_id', $user->id))
            ->latest()
            ->get()
            ->map(function ($ticket) {
                $statusMap = [
                    'submitted'   => 'todo',
                    'to_do'       => 'todo',
                    'in_progress' => 'progress',
                    'progress'    => 'progress',
                    'resolved'    => 'done',
                    'done'        => 'done',
                ];

                return [
                    'id' => $ticket->id,
                    'title' => $ticket->title,
                    'description' => $ticket->description,
                    'tag' => $ticket->unit ? "Unit {$ticket->unit->name}" : 'General',
                    'status' => $statusMap[strtolower($ticket->status)] ?? 'todo',
                    'raw_status' => $ticket->status,
                    'created_at' => $ticket->created_at->format('M d, Y'),
                ];
            });

        $units = Unit::select('id', 'name')->get();

        $page = $user->hasRole('tenant') ? 'tenant/maintenance' : 'dashboard/maintenance';

        return Inertia::render($page, [
            'requests' => $requests,
            'units' => $units,
        ]);
    }

    public function store(StoreMaintenanceRequestRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();

        // 1. Resolve unit_id: provided directly or derived from the tenant's active lease
       // In MaintenanceRequestController.php store() method
$unitId = $request->validated()['unit_id'] ?? null;

if (!$unitId) {
    $activeLease = \App\Models\Lease::where('tenant_id', $request->user()->id)
        ->where('status', 'active')
        ->first();

    $unitId = $activeLease?->unit_id;
}

if (!$unitId) {
    return back()->withErrors(['unit_id' => 'No active lease/unit assigned to this account.']);
}

$unit = Unit::with('property')->findOrFail($unitId);
        // 2. Process photo uploads
        $photoPaths = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $photoPaths[] = $photo->store('maintenance-photos/'.$unit->id, 'public');
            }
        }

        // 3. Create Maintenance Request
        MaintenanceRequest::create([
            'unit_id' => $unit->id,
            'tenant_id' => $user->id,
            'landlord_id' => $unit->property->landlord_id,
            'title' => $validated['title'] ?? ucfirst($validated['category'] ?? 'General Maintenance'),
            'description' => $validated['description'],
            'priority' => $validated['priority'] ?? 'medium',
            'status' => 'submitted',
            'photo_paths' => $photoPaths,
        ]);

        return back()->with('success', 'Maintenance request submitted.');
    }

    public function updateStatus(Request $request, MaintenanceRequest $maintenanceRequest)
    {
        $this->authorize('update', $maintenanceRequest);

        $validated = $request->validate([
            'status' => 'required|in:todo,progress,done',
        ]);

        $dbStatusMap = [
            'todo' => 'to_do',
            'progress' => 'in_progress',
            'done' => 'resolved',
        ];

        $newStatus = $dbStatusMap[$validated['status']];
        $wasStatus = $maintenanceRequest->status;

        $maintenanceRequest->update([
            'status' => $newStatus,
            'resolved_at' => $newStatus === 'resolved' ? now() : null,
        ]);

        if ($newStatus !== $wasStatus && $maintenanceRequest->tenant) {
            $maintenanceRequest->tenant->notify(new MaintenanceStatusChanged($maintenanceRequest));
        }

        return back()->with('success', 'Status updated.');
    }
}