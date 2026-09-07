<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeaseRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Lease;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LeaseController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $this->authorize('viewAny', Lease::class);

        $user = $request->user();

        $leases = Lease::with(['unit.property', 'tenant:id,name,email'])
            ->when($user->hasRole('landlord'), fn ($q) => $q->where('landlord_id', $user->id))
            ->when($user->hasRole('tenant'), fn ($q) => $q->where('tenant_id', $user->id))
            ->latest()
            ->get();

        $units = [];
        $tenants = [];

        if ($user->hasRole('landlord')) {
            // Fetch units owned by the landlord via property relation
            $units = Unit::whereHas('property', fn ($q) => $q->where('landlord_id', $user->id))
                ->with('property:id,name')
                ->select('id', 'property_id', 'unit_number', 'rent_amount', 'status')
                ->get();

            // Fetch tenants registered in the system
            $tenants = User::role('tenant')
                ->select('id', 'name', 'email')
                ->get();
        }

        return Inertia::render('dashboard/tenants', [
            'leases' => $leases,
            'units' => $units,
            'tenants' => $tenants,
        ]);
    }

    public function store(StoreLeaseRequest $request)
    {
        $unit = Unit::findOrFail($request->validated()['unit_id']);
        $this->authorize('update', $unit);

        $lease = DB::transaction(function () use ($request, $unit) {
            $lease = Lease::create([
                ...$request->validated(),
                'landlord_id' => $request->user()->id,
                'status' => 'active',
            ]);

            $unit->update(['status' => 'occupied']);

            return $lease;
        });

        return back()->with('success', 'Lease created.');
    }
}
