<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;

class InvoicePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['landlord', 'tenant', 'admin']);
    }

    public function view(User $user, Invoice $invoice): bool
    {
        return $user->hasRole('admin')
            || $invoice->lease->landlord_id === $user->id
            || $invoice->lease->tenant_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole(['landlord', 'admin']);
    }

    public function update(User $user, Invoice $invoice): bool
    {
        return $user->hasRole('admin') || $invoice->lease->landlord_id === $user->id;
    }
}
