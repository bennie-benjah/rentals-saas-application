<?php

namespace App\Notifications;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RentDueNotification extends Notification implements \Illuminate\Contracts\Queue\ShouldQueue
{
    use Queueable;

    public function __construct(private Invoice $invoice) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $overdue = $this->invoice->due_date->isPast();

        return (new MailMessage)
            ->subject($overdue ? 'Rent overdue' : 'Rent due soon')
            ->line('Invoice '.$this->invoice->reference.' for '.$this->invoice->currency.' '.number_format($this->invoice->balance, 2).' is due '.$this->invoice->due_date->format('M j, Y').'.')
            ->action('Pay now', url('/tenant/pay'))
            ->line('Thanks for keeping your account current.');
    }

    public function toArray($notifiable): array
    {
        return [
            'invoice_id' => $this->invoice->id,
            'reference' => $this->invoice->reference,
            'balance' => $this->invoice->balance,
            'due_date' => $this->invoice->due_date->toDateString(),
        ];
    }
}
