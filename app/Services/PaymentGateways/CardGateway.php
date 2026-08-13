<?php

namespace App\Services\PaymentGateways;

use App\Models\Payment;

/**
 * Placeholder — wire this up to Stripe, Flutterwave, or your preferred
 * card processor. Follow the same pattern as MpesaGateway/PaypalGateway:
 * initiate() only starts the transaction, a webhook confirms it.
 */
class CardGateway implements PaymentGatewayInterface
{
    public function initiate(Payment $payment, array $data): array
    {
        throw new \RuntimeException('Card payments are not yet configured. Implement CardGateway against your chosen processor.');
    }
}
