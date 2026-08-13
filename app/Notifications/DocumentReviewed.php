<?php

namespace App\Notifications;

use App\Models\IdDocument;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DocumentReviewed extends Notification implements \Illuminate\Contracts\Queue\ShouldQueue
{
    use Queueable;

    public function __construct(private IdDocument $document) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        $approved = $this->document->status === 'approved';

        return (new MailMessage)
            ->subject($approved ? 'Document approved' : 'Document needs attention')
            ->line('Your '.str($this->document->kind)->replace('_', ' ').' has been '.$this->document->status.'.')
            ->when(! $approved && $this->document->review_notes, fn ($mail) => $mail->line('Reviewer notes: '.$this->document->review_notes))
            ->action('View status', url('/dashboard/verification'));
    }

    public function toArray($notifiable): array
    {
        return [
            'document_id' => $this->document->id,
            'status' => $this->document->status,
        ];
    }
}
