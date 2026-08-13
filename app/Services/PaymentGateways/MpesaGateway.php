<?php

namespace App\Services\PaymentGateways;

use App\Models\Payment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * M-Pesa STK Push via Safaricom's Daraja API.
 * Requires in .env: MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET,
 * MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_CALLBACK_URL, MPESA_ENV (sandbox|production).
 * Never commit these — .env is already gitignored by default.
 */
class MpesaGateway implements PaymentGatewayInterface
{
    public function initiate(Payment $payment, array $data): array
    {
        $baseUrl = config('services.mpesa.env') === 'production'
            ? 'https://api.safaricom.co.ke'
            : 'https://sandbox.safaricom.co.ke';

        $token = $this->getAccessToken($baseUrl);
        $timestamp = now()->format('YmdHis');
        $shortcode = config('services.mpesa.shortcode');
        $password = base64_encode($shortcode.config('services.mpesa.passkey').$timestamp);

        $response = Http::withToken($token)->post("{$baseUrl}/mpesa/stkpush/v1/processrequest", [
            'BusinessShortCode' => $shortcode,
            'Password' => $password,
            'Timestamp' => $timestamp,
            'TransactionType' => 'CustomerPayBillOnline',
            'Amount' => (int) $data['amount'],
            'PartyA' => $data['phone'],
            'PartyB' => $shortcode,
            'PhoneNumber' => $data['phone'],
            'CallBackURL' => config('services.mpesa.callback_url'),
            'AccountReference' => $payment->invoice_id,
            'TransactionDesc' => 'Rent payment',
        ]);

        if ($response->failed()) {
            Log::error('M-Pesa STK push failed', ['response' => $response->body()]);
            throw new \RuntimeException('Could not initiate M-Pesa payment. Please try again.');
        }

        $checkoutRequestId = $response->json('CheckoutRequestID');
        $payment->update(['gateway_reference' => $checkoutRequestId]);

        return [
            'status' => 'pending_stk_push',
            'checkout_request_id' => $checkoutRequestId,
            'message' => 'Check your phone to complete the M-Pesa payment.',
        ];
    }

    private function getAccessToken(string $baseUrl): string
    {
        $response = Http::withBasicAuth(
            config('services.mpesa.consumer_key'),
            config('services.mpesa.consumer_secret'),
        )->get("{$baseUrl}/oauth/v1/generate?grant_type=client_credentials");

        return $response->json('access_token');
    }
}
