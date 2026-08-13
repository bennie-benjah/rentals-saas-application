<?php

namespace App\Policies;

use App\Models\Unit;
use App\Models\User;

class UnitPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['landlord', 'admin']);
    }

    public function view(User $user, Unit $unit): bool
    {
        return $user->hasRole('admin') || $unit->property->landlord_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('landlord');
    }

    public function update(User $user, Unit $unit): bool
    {
        return $user->hasRole('admin') || $unit->property->landlord_id === $user->id;
    }

    public function delete(User $user, Unit $unit): bool
    {
        return $user->hasRole('admin') || $unit->property->landlord_id === $user->id;
    }
}
