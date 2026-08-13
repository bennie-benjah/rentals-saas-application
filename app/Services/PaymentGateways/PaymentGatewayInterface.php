<?php

namespace App\Services\PaymentGateways;

use App\Models\Payment;

interface PaymentGatewayInterface
{
    /**
     * Kick off a payment with the gateway. Must NOT mark the payment as
     * completed — only the gateway's webhook does that, once it confirms
     * the transaction actually succeeded.
     *
     * @return array Gateway-specific response data returned to the frontend
     *               (e.g. a redirect URL, or an STK push confirmation).
     */
    public function initiate(Payment $payment, array $data): array;
}
