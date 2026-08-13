<?php

namespace App\Policies;

use App\Models\Lease;
use App\Models\User;

class LeasePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['landlord', 'tenant', 'admin']);
    }

    public function view(User $user, Lease $lease): bool
    {
        return $user->hasRole('admin')
            || $lease->landlord_id === $user->id
            || $lease->tenant_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole(['landlord', 'admin']);
    }

    public function update(User $user, Lease $lease): bool
    {
        return $user->hasRole('admin') || $lease->landlord_id === $user->id;
    }

    public function delete(User $user, Lease $lease): bool
    {
        return $user->hasRole('admin') || $lease->landlord_id === $user->id;
    }
}
