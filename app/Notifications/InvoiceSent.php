<?php

namespace App\Notifications;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvoiceSent extends Notification
{
    use Queueable;

    public function __construct(public Invoice $invoice) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Invoice #' . $this->invoice->id)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('A new invoice has been generated for your tenancy.')
            ->line('Amount Due: $' . number_format($this->invoice->amount, 2))
            ->line('Due Date: ' . $this->invoice->due_date->format('M d, Y'))
            ->action('View & Pay Invoice', url('/tenant/pay'))
            ->line('Thank you for using our platform!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'invoice_id' => $this->invoice->id,
            'amount'     => $this->invoice->amount,
            'due_date'   => $this->invoice->due_date->toDateString(),
            'message'    => 'New invoice generated for $' . number_format($this->invoice->amount, 2),
        ];
    }
}
