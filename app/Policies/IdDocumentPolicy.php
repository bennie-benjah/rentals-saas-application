<?php

namespace App\Policies;

use App\Models\IdDocument;
use App\Models\User;

class IdDocumentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['admin', 'reviewer']);
    }

    public function view(User $user, IdDocument $document): bool
    {
        return $user->hasRole(['admin', 'reviewer']) || $document->owner_id === $user->id;
    }

    public function review(User $user, IdDocument $document): bool
    {
        return $user->hasRole(['admin', 'reviewer']);
    }
}
