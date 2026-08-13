<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use App\Models\Lease;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateRecurringInvoices extends Command
{
    protected $signature = 'invoices:generate';

    protected $description = 'Generate invoices for active leases whose billing day is today (and no invoice exists yet for the current period).';

    public function handle(): int
    {
        $today = now();
        $generated = 0;

        Lease::where('status', 'active')
            ->where('billing_day', $today->day)
            ->chunk(50, function ($leases) use ($today, &$generated) {
                foreach ($leases as $lease) {
                    $periodStart = $today->copy()->startOfDay();
                    $periodEnd = match ($lease->billing_cycle) {
                        'quarterly' => $periodStart->copy()->addMonths(3)->subDay(),
                        'annual' => $periodStart->copy()->addYear()->subDay(),
                        default => $periodStart->copy()->addMonth()->subDay(),
                    };

                    $exists = Invoice::where('lease_id', $lease->id)
                        ->where('period_start', $periodStart->toDateString())
                        ->exists();

                    if ($exists) {
                        continue;
                    }

                    Invoice::create([
                        'lease_id' => $lease->id,
                        'reference' => 'INV-'.strtoupper(Str::random(8)),
                        'amount_due' => $lease->rent_amount,
                        'currency' => $lease->currency,
                        'period_start' => $periodStart,
                        'period_end' => $periodEnd,
                        'due_date' => $periodStart->copy()->addDays(5),
                        'status' => 'unpaid',
                    ]);

                    $generated++;
                }
            });

        $this->info("Generated {$generated} invoice(s).");

        return self::SUCCESS;
    }
}
