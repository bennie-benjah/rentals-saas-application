<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Notifications\PaymentReceivedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * SECURITY: this route must be excluded from CSRF (registered under the
 * 'api' middleware group or added to VerifyCsrfToken's except list) since
 * Safaricom's servers call it directly, not an authenticated browser.
 *
 * SECURITY: verify the callback is genuinely from Safaricom before trusting
 * it — at minimum check the source IP against Safaricom's published ranges,
 * and store your Daraja credentials/passkey in .env, never in code.
 * Do not mark a payment completed based on client-controlled input alone.
 */
class MpesaWebhookController extends Controller
{
    public function __invoke(Request $request)
    {
        Log::info('M-Pesa callback received', $request->all());

        $checkoutRequestId = $request->input('Body.stkCallback.CheckoutRequestID');
        $resultCode = $request->input('Body.stkCallback.ResultCode');

        $payment = Payment::where('gateway_reference', $checkoutRequestId)->first();

        if (! $payment) {
            Log::warning('M-Pesa callback for unknown payment', ['checkout_request_id' => $checkoutRequestId]);

            return response()->json(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
        }

        if ((int) $resultCode === 0) {
            $items = collect($request->input('Body.stkCallback.CallbackMetadata.Item', []));
            $receipt = $items->firstWhere('Name', 'MpesaReceiptNumber')['Value'] ?? null;

            $payment->update([
                'status' => 'completed',
                'gateway_reference' => $receipt ?? $payment->gateway_reference,
                'gateway_response' => $request->all(),
                'paid_at' => now(),
            ]);

            $invoice = $payment->invoice;
            $invoice->increment('amount_paid', $payment->amount);
            $invoice->markPaidIfSettled();

            $payment->payer->notify(new PaymentReceivedNotification($payment));
        } else {
            $payment->update([
                'status' => 'failed',
                'gateway_response' => $request->all(),
            ]);
        }

        // Safaricom expects this exact acknowledgement shape.
        return response()->json(['ResultCode' => 0, 'ResultDesc' => 'Accepted']);
    }
}
