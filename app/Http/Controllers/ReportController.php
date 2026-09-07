<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Lease;
use App\Models\MaintenanceRequest;
use App\Models\Property;
use App\Models\Unit;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\CarbonInterface;
class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/reports');
    }

    // In app/Http/Controllers/ReportController.php

public function export(Request $request)
{
    $request->validate([
        'report_type' => 'required|string|in:pnl,rent_roll,delinquency,maintenance',
        'format'      => 'required|string|in:xlsx,csv,pdf',
        'start_date'  => 'nullable|date',
        'end_date'    => 'nullable|date',
    ]);

    $type = $request->report_type;
    $format = $request->format;
    $startDate = $request->start_date ? Carbon::parse($request->start_date) : now()->startOfYear();
    $endDate = $request->end_date ? Carbon::parse($request->end_date) : now()->endOfDay();

    $data = $this->buildReportData($type, $startDate, $endDate);
    $fileName = "{$type}_report_" . now()->format('Y_m_d');

    // Handle CSV or Excel (CSV format opens directly in Excel)
    if ($format === 'csv' || $format === 'xlsx') {
        return response()->streamDownload(function () use ($data) {
            $file = fopen('php://output', 'w');

            // Write column headers
            fputcsv($file, $data['headers']);

            // Write data rows
            foreach ($data['rows'] as $row) {
                fputcsv($file, $row);
            }

            fclose($file);
        }, "{$fileName}.csv", [
            'Content-Type' => 'text/csv',
        ]);
    }

    // Render clean printable HTML report view
    return view("reports.print", $data);
}

    private function buildReportData(string $type, CarbonInterface $startDate, CarbonInterface $endDate): array
{
    return match ($type) {
        'rent_roll' => [
            'headers' => ['Property', 'Unit', 'Tenant', 'Monthly Rent', 'Status', 'Lease End'],
            'rows' => Lease::with(['unit.property', 'tenant'])
                ->get()
                ->map(fn ($l) => [
                    $l->unit->property->name ?? 'N/A',
                    $l->unit->name ?? 'N/A',
                    $l->tenant->name ?? 'Vacant',
                    '$' . number_format($l->rent_amount, 2),
                    ucfirst($l->status),
                    $l->end_date ? $l->end_date->format('Y-m-d') : 'N/A',
                ])->toArray(),
        ],

        'pnl' => [
            'headers' => ['Category', 'Type', 'Amount'],
            'rows' => [
                ['Rental Income Collected', 'Revenue', '$' . number_format(Invoice::whereBetween('updated_at', [$startDate, $endDate])->sum('amount_paid'), 2)],
                ['Maintenance & Repairs', 'Expense', '$' . number_format(MaintenanceRequest::whereBetween('created_at', [$startDate, $endDate])->sum('cost'), 2)],
            ],
        ],

        'delinquency' => [
            'headers' => ['Tenant', 'Unit', 'Amount Due', 'Due Date'],
            'rows' => Invoice::with(['lease.tenant', 'lease.unit'])
                ->where('status', 'unpaid')
                ->where('due_date', '<', now())
                ->get()
                ->map(fn ($i) => [
                    $i->lease->tenant->name ?? 'Unknown',
                    $i->lease->unit->name ?? 'N/A',
                    '$' . number_format($i->amount, 2),
                    $i->due_date ? $i->due_date->format('Y-m-d') : 'N/A',
                ])->toArray(),
        ],

        'maintenance' => [
            'headers' => ['Ticket ID', 'Unit', 'Title', 'Status', 'Cost', 'Created Date'],
            'rows' => MaintenanceRequest::with('unit')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->get()
                ->map(fn ($m) => [
                    "#{$m->id}",
                    $m->unit->name ?? 'General',
                    $m->title,
                    ucfirst($m->status),
                    '$' . number_format($m->cost ?? 0, 2),
                    $m->created_at->format('Y-m-d'),
                ])->toArray(),
        ],
    };
}
}
