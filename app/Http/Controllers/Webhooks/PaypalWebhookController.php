<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Notifications\PaymentReceivedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * SECURITY: verify the webhook signature via PayPal's
 * /v1/notifications/verify-webhook-signature endpoint before trusting
 * any payload — do not skip this in production. This stub logs and
 * trusts the payload for development purposes only.
 */
class PaypalWebhookController extends Controller
{
    public function __invoke(Request $request)
    {
        Log::info('PayPal webhook received', $request->all());

        // TODO: verify signature — see srmklive/paypal or PayPal's SDK docs
        // for the verify-webhook-signature call before processing further.

        $eventType = $request->input('event_type');
        $orderId = $request->input('resource.id');

        if ($eventType !== 'CHECKOUT.ORDER.APPROVED' && $eventType !== 'PAYMENT.CAPTURE.COMPLETED') {
            return response()->json(['status' => 'ignored']);
        }

        $payment = Payment::where('gateway_reference', $orderId)->first();

        if (! $payment) {
            Log::warning('PayPal webhook for unknown payment', ['order_id' => $orderId]);

            return response()->json(['status' => 'unknown_payment'], 200);
        }

        $payment->update([
            'status' => 'completed',
            'gateway_response' => $request->all(),
            'paid_at' => now(),
        ]);

        $invoice = $payment->invoice;
        $invoice->increment('amount_paid', $payment->amount);
        $invoice->markPaidIfSettled();

        $payment->payer->notify(new PaymentReceivedNotification($payment));

        return response()->json(['status' => 'ok']);
    }
}
