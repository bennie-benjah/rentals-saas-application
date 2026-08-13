<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeaseRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Lease;
use App\Models\Unit;
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

        return Inertia::render('dashboard/tenants', ['leases' => $leases]);
    }

    public function store(StoreLeaseRequest $request)
    {
        $unit = Unit::findOrFail($request->validated()['unit_id']);
        $this->authorize('update', $unit); // must own the unit's property to create a lease on it

        $lease = DB::transaction(function () use ($request, $unit) {
            $lease = Lease::create([
                ...$request->validated(),
                'landlord_id' => $request->user()->id,
                'status' => 'active',
            ]);

            $unit->update(['status' => 'occupied']);

            return $lease;
        });

        return back()->with('success', 'Lease created.')->with('lease', $lease);
    }

    public function update(Request $request, Lease $lease)
    {
        $this->authorize('update', $lease);

        $data = $request->validate([
            'status' => ['sometimes', 'required', 'string', 'in:pending,active,ended,terminated'],
            'end_date' => ['nullable', 'date'],
        ]);

        $lease->update($data);

        if (in_array($data['status'] ?? null, ['ended', 'terminated'], true)) {
            $lease->unit->update(['status' => 'vacant']);
        }

        return back()->with('success', 'Lease updated.');
    }
}
