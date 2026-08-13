<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\MaintenanceRequest;
use App\Models\Property;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $landlordId = $request->user()->id;

        $totalUnits = Unit::whereHas('property', fn ($q) => $q->where('landlord_id', $landlordId))->count();
        $occupiedUnits = Unit::whereHas('property', fn ($q) => $q->where('landlord_id', $landlordId))
            ->where('status', 'occupied')->count();

        $revenueThisMonth = Invoice::whereHas('lease', fn ($q) => $q->where('landlord_id', $landlordId))
            ->whereMonth('due_date', now()->month)
            ->whereYear('due_date', now()->year)
            ->sum('amount_paid');

        $openTickets = MaintenanceRequest::where('landlord_id', $landlordId)
            ->whereNotIn('status', ['resolved', 'cancelled'])
            ->count();

        return Inertia::render('dashboard/index', [
            'stats' => [
                'occupancy' => $totalUnits > 0 ? round(($occupiedUnits / $totalUnits) * 100, 1) : 0,
                'revenue' => (float) $revenueThisMonth,
                'total_properties' => Property::where('landlord_id', $landlordId)->count(),
                'total_units' => $totalUnits,
                'open_tickets' => $openTickets,
            ],
        ]);
    }
}
