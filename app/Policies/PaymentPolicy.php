<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    public function view(User $user, Payment $payment): bool
    {
        return $user->hasRole('admin')
            || $payment->payer_id === $user->id
            || $payment->invoice->lease->landlord_id === $user->id;
    }

    public function create(User $user, \App\Models\Invoice $invoice): bool
    {
        // Only the tenant on the lease may initiate a payment for their own invoice.
        return $invoice->lease->tenant_id === $user->id;
    }
}
