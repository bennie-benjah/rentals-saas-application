<?php

namespace App\Services\PaymentGateways;

use App\Models\Payment;
use Illuminate\Support\Facades\Http;

/**
 * Requires in .env: PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENV (sandbox|live).
 */
class PaypalGateway implements PaymentGatewayInterface
{
    public function initiate(Payment $payment, array $data): array
    {
        $baseUrl = config('services.paypal.env') === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';

        $token = Http::withBasicAuth(
            config('services.paypal.client_id'),
            config('services.paypal.client_secret'),
        )->asForm()->post("{$baseUrl}/v1/oauth2/token", ['grant_type' => 'client_credentials'])
            ->json('access_token');

        $order = Http::withToken($token)->post("{$baseUrl}/v2/checkout/orders", [
            'intent' => 'CAPTURE',
            'purchase_units' => [[
                'reference_id' => (string) $payment->invoice_id,
                'amount' => ['currency_code' => $payment->currency, 'value' => number_format($data['amount'], 2, '.', '')],
            ]],
        ])->json();

        $payment->update(['gateway_reference' => $order['id'] ?? null]);

        $approveLink = collect($order['links'] ?? [])->firstWhere('rel', 'approve')['href'] ?? null;

        return [
            'status' => 'pending_approval',
            'order_id' => $order['id'] ?? null,
            'redirect_url' => $approveLink,
        ];
    }
}
