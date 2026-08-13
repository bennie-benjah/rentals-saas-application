<?php

namespace App\Notifications;

use App\Models\MaintenanceRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MaintenanceStatusChanged extends Notification implements \Illuminate\Contracts\Queue\ShouldQueue
{
    use Queueable;

    public function __construct(private MaintenanceRequest $request) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Update on your maintenance request')
            ->line('"'.$this->request->title.'" is now: '.str($this->request->status)->headline())
            ->action('View request', url('/tenant/maintenance'))
            ->line('Thanks for using EstateOS.');
    }

    public function toArray($notifiable): array
    {
        return [
            'maintenance_request_id' => $this->request->id,
            'title' => $this->request->title,
            'status' => $this->request->status,
        ];
    }
}
