<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Payment;
use App\Services\PaymentGateways\PaymentGatewayManager;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private PaymentGatewayManager $gateways) {}

    /**
     * POST /invoices/{invoice}/pay — tenant initiates a payment.
     * Creates a pending Payment row, then hands off to the selected
     * gateway (M-Pesa STK push, PayPal order, etc). The gateway's
     * webhook is what actually confirms and completes the payment —
     * this endpoint never marks a payment as completed itself.
     */
    public function store(Request $request, Invoice $invoice)
    {
        $this->authorize('create', [Payment::class, $invoice]);

        $data = $request->validate([
            'method' => ['required', 'string', 'in:mpesa,card,paypal'],
            'amount' => ['required', 'numeric', 'min:1', 'max:'.$invoice->balance],
            'phone' => ['required_if:method,mpesa', 'nullable', 'string'],
        ]);

        $payment = Payment::create([
            'invoice_id' => $invoice->id,
            'payer_id' => $request->user()->id,
            'amount' => $data['amount'],
            'currency' => $invoice->currency,
            'method' => $data['method'],
            'status' => 'pending',
        ]);

        $result = $this->gateways->driver($data['method'])->initiate($payment, $data);

        return response()->json([
            'payment_id' => $payment->id,
            ...$result, // e.g. ['redirect_url' => ...] or ['checkout_request_id' => ...]
        ]);
    }
}
