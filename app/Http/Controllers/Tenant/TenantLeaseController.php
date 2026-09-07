<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Lease;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class TenantLeaseController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        $leaseModel = Lease::with(['unit.property'])
            ->where('tenant_id', $user->id)
            ->where('status', 'active')
            ->latest()
            ->first();

        if (!$leaseModel) {
            return Inertia::render('tenant/lease', [
                'lease' => null,
            ]);
        }

        $startDate = $leaseModel->start_date 
            ? Carbon::parse($leaseModel->start_date)->format('M d, Y') 
            : 'N/A';

        $endDate = $leaseModel->end_date 
            ? Carbon::parse($leaseModel->end_date)->format('M d, Y') 
            : 'Month-to-Month';

        $leaseData = [
            'id'              => $leaseModel->id,
            'status'          => ucfirst($leaseModel->status),
            'propertyName'    => $leaseModel->unit->property->name ?? 'Property',
            'unitName'        => 'Unit ' . ($leaseModel->unit->unit_number ?? $leaseModel->unit->name ?? 'N/A'),
            'startDate'       => $startDate,
            'endDate'         => $endDate,
            'monthlyRent'     => '$' . number_format($leaseModel->rent_amount, 2),
            'securityDeposit' => '$' . number_format($leaseModel->deposit_amount ?? 0, 2),
            'documents'       => [],
        ];

        return Inertia::render('tenant/lease', [
            'lease' => $leaseData,
        ]);
    }
}