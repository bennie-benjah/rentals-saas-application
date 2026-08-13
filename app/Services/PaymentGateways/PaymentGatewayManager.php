<?php

namespace App\Services\PaymentGateways;

use InvalidArgumentException;

class PaymentGatewayManager
{
    public function driver(string $method): PaymentGatewayInterface
    {
        return match ($method) {
            'mpesa' => app(MpesaGateway::class),
            'paypal' => app(PaypalGateway::class),
            'card' => app(CardGateway::class),
            default => throw new InvalidArgumentException("Unknown payment method: {$method}"),
        };
    }
}
