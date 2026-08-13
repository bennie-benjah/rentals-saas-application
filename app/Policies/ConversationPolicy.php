<?php

namespace App\Policies;

use App\Models\Conversation;
use App\Models\User;

class ConversationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['landlord', 'tenant', 'admin']);
    }

    public function view(User $user, Conversation $conversation): bool
    {
        return $user->hasRole('admin')
            || $conversation->landlord_id === $user->id
            || $conversation->tenant_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole(['landlord', 'tenant']);
    }

    public function sendMessage(User $user, Conversation $conversation): bool
    {
        return $conversation->landlord_id === $user->id || $conversation->tenant_id === $user->id;
    }
}
