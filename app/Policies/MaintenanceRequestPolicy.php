<?php

namespace App\Policies;

use App\Models\MaintenanceRequest;
use App\Models\User;

class MaintenanceRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['landlord', 'tenant', 'admin']);
    }

    public function view(User $user, MaintenanceRequest $request): bool
    {
        return $user->hasRole('admin')
            || $request->landlord_id === $user->id
            || $request->tenant_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('tenant');
    }

    public function update(User $user, MaintenanceRequest $request): bool
    {
        // Landlord (or assigned staff) can change status; tenant can only
        // update while still in the initial "submitted" state (e.g. add detail).
        if ($user->hasRole('admin') || $request->landlord_id === $user->id) {
            return true;
        }

        return $request->tenant_id === $user->id && $request->status === 'submitted';
    }
}
