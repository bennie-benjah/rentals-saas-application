<?php

namespace App\Policies;

use App\Models\Announcement;
use App\Models\User;

class AnnouncementPolicy
{
    public function create(User $user): bool
    {
        return $user->hasRole(['landlord', 'admin']);
    }

    public function update(User $user, Announcement $announcement): bool
    {
        return $user->hasRole('admin') || $announcement->landlord_id === $user->id;
    }

    public function delete(User $user, Announcement $announcement): bool
    {
        return $user->hasRole('admin') || $announcement->landlord_id === $user->id;
    }
}
