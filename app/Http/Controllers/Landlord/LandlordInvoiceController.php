<?php

namespace App\Http\Controllers\Landlord;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Lease;
use App\Notifications\InvoiceSent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
class LandlordInvoiceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get active leases for dropdown
        $leases = Lease::with(['tenant:id,name', 'unit:id,unit_number,name'])
            ->when($user->hasRole('landlord'), fn ($q) => $q->where('landlord_id', $user->id))
            ->where('status', 'active')
            ->get()
            ->map(fn ($l) => [
                'id'         => $l->id,
                'tenantName' => $l->tenant->name ?? 'Unknown Tenant',
                'unitName'   => $l->unit->unit_number ?? $l->unit->name ?? 'N/A',
            ]);

        // Get ledger records
        $invoices = Invoice::with(['tenant:users.id,name', 'lease.unit'])
    ->when($user->hasRole('landlord'), function ($q) use ($user) {
        $q->whereHas('lease', fn ($l) => $l->where('landlord_id', $user->id));
    })
    ->latest()
    ->get();

        // 2. Map ledger items using your model's actual field names
$ledger = $invoices->map(fn ($i) => [
    'id'     => $i->id,
    'desc'   => ($i->tenant->name ?? 'Tenant') . ' - Invoice #' . $i->reference,
    'date'   => $i->created_at ? $i->created_at->format('M d, Y') : 'N/A',
    'amount' => '$' . number_format($i->amount_due, 2),
    'paid'   => '$' . number_format($i->amount_paid, 2),
    'status' => $i->status,
    'tone'   => 'in',
]);

        return Inertia::render('dashboard/finance', [
            'leases' => $leases,
            'ledger' => $ledger,
        ]);
    }

   public function store(Request $request)
    {
        $validated = $request->validate([
            'lease_id' => ['required', 'exists:leases,id'],
            'amount'   => ['required', 'numeric', 'min:0.01'],
            'due_date' => ['required', 'date', 'after_or_equal:today'],
            'details'  => ['nullable', 'string'],
        ]);

        $lease = Lease::with('tenant')->findOrFail($validated['lease_id']);

        $invoice = Invoice::create([
            'lease_id'     => $lease->id,
            'reference'    => 'INV-' . strtoupper(Str::random(8)),
            'amount_due'   => $validated['amount'],
            'amount_paid'  => 0.00,
            'currency'     => 'USD',
            'period_start' => now()->startOfMonth()->toDateString(),
            'period_end'   => Carbon::parse($validated['due_date'])->toDateString(),
            'due_date'     => $validated['due_date'],
            'status'       => 'unpaid', // Matches schema enum constraint
        ]);

        if ($lease->tenant) {
            $lease->tenant->notify(new InvoiceSent($invoice));
        }

        return back()->with('success', 'Invoice sent to tenant successfully.');
    }
}
