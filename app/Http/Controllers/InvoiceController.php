<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Invoice::class);

        $user = $request->user();

        // Base invoice query filtered by user role
        $query = Invoice::with(['lease.unit.property', 'lease.tenant:id,name,email'])
            ->when($user->hasRole('landlord'), fn ($q) => $q->whereHas('lease', fn ($q2) => $q2->where('landlord_id', $user->id)))
            ->when($user->hasRole('tenant'), fn ($q) => $q->whereHas('lease', fn ($q2) => $q2->where('tenant_id', $user->id)));

        $invoices = (clone $query)->latest('due_date')->get();

        // 1. Calculate Real Metrics
        $collectedMtd = (clone $query)
            ->whereMonth('updated_at', now()->month)
            ->whereYear('updated_at', now()->year)
            ->sum('amount_paid');

        $outstanding = (clone $query)
            ->whereIn('status', ['unpaid', 'partial', 'overdue'])
            ->get()
            ->sum(fn ($inv) => $inv->amount_due - $inv->amount_paid);

        $operatingExp = 0; // Replace with Expense::sum('amount') if expense tracking exists
        $netIncome = $collectedMtd - $operatingExp;

        $stats = [
            'collectedMtd' => '$' . number_format($collectedMtd, 2),
            'outstanding' => '$' . number_format($outstanding, 2),
            'operatingExp' => '$' . number_format($operatingExp, 2),
            'netIncome' => '$' . number_format($netIncome, 2),
        ];

        // 2. Generate Monthly Revenue Performance Data (Last 8 Months)
        $chartData = collect(range(7, 0))->map(function ($i) use ($query) {
            $date = now()->subMonths($i);
            $totalCollected = (clone $query)
                ->whereMonth('updated_at', $date->month)
                ->whereYear('updated_at', $date->year)
                ->sum('amount_paid');

            return [
                'm' => $date->format('M'),
                'rawVal' => (float) $totalCollected,
            ];
        });

        $maxVal = $chartData->max('rawVal') ?: 1;
        $revenueChart = $chartData->map(function ($d) use ($maxVal) {
            return [
                'm' => $d['m'],
                'v' => $maxVal > 0 ? round(($d['rawVal'] / $maxVal) * 100) : 0,
                'amount' => '$' . number_format($d['rawVal'], 2),
                'peak' => $d['rawVal'] === $maxVal && $maxVal > 0,
            ];
        });

        // 3. Transform Invoices to Ledger Entries
        $ledger = $invoices->take(10)->map(function ($inv) {
            $tenantName = $inv->lease?->tenant?->name ?? 'Tenant';
            $unitName = $inv->lease?->unit?->name ?? 'Unit';

            return [
                'id' => $inv->id,
                'date' => $inv->due_date ? $inv->due_date->format('M d') : 'N/A',
                'desc' => "Invoice #{$inv->reference} · {$tenantName} ({$unitName})",
                'amount' => '$' . number_format($inv->amount_due, 2),
                'paid' => '$' . number_format($inv->amount_paid, 2),
                'status' => $inv->status,
                'tone' => $inv->status === 'paid' ? 'in' : 'out',
            ];
        });

        $page = $user->hasRole('tenant') ? 'tenant/pay' : 'dashboard/finance';

        return Inertia::render($page, [
            'invoices' => $invoices,
            'stats' => $stats,
            'revenueChart' => $revenueChart,
            'ledger' => $ledger,
        ]);
    }

    public function show(Invoice $invoice)
    {
        Gate::authorize('view', $invoice);

        return response()->json($invoice->load('payments'));
    }
    public function checkout(Request $request, Invoice $invoice)
{
    // Ensure tenant can only view their own invoice
    Gate::authorize('view', $invoice);

    return Inertia::render('tenant/payments/checkout', [
        'invoice' => $invoice->load(['lease.unit.property']),
    ]);
}
}