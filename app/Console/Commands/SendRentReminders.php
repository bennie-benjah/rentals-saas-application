<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use App\Notifications\RentDueNotification;
use Illuminate\Console\Command;

class SendRentReminders extends Command
{
    protected $signature = 'invoices:send-reminders';

    protected $description = 'Notify tenants about invoices due within 3 days or already overdue, at most once per 24h.';

    public function handle(): int
    {
        $invoices = Invoice::with('lease.tenant')
            ->whereIn('status', ['unpaid', 'partial', 'overdue'])
            ->where(function ($q) {
                $q->whereBetween('due_date', [now(), now()->addDays(3)])
                    ->orWhere('due_date', '<', now());
            })
            ->where(function ($q) {
                $q->whereNull('reminder_sent_at')
                    ->orWhere('reminder_sent_at', '<', now()->subDay());
            })
            ->get();

        foreach ($invoices as $invoice) {
            if ($invoice->due_date->isPast() && $invoice->status !== 'overdue') {
                $invoice->update(['status' => 'overdue']);
            }

            $invoice->lease->tenant->notify(new RentDueNotification($invoice));
            $invoice->update(['reminder_sent_at' => now()]);
        }

        $this->info('Sent '.$invoices->count().' rent reminder(s).');

        return self::SUCCESS;
    }
}
