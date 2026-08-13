<?php

namespace App\Jobs;

use App\Models\Announcement;
use App\Models\Lease;
use App\Notifications\NewAnnouncementNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Dispatched instead of notifying inline from the controller, so posting an
 * announcement to a large portfolio (hundreds of tenants) doesn't block the
 * landlord's request-response cycle. Each individual notification is also
 * queued (NewAnnouncementNotification implements ShouldQueue), so this job's
 * real job is just resolving *which* tenants are affected.
 */
class NotifyTenantsOfAnnouncement implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(private Announcement $announcement) {}

    public function handle(): void
    {
        $tenantsQuery = Lease::where('landlord_id', $this->announcement->landlord_id)
            ->where('status', 'active')
            ->with('tenant');

        if ($this->announcement->property_id) {
            $tenantsQuery->whereHas('unit', fn ($q) => $q->where('property_id', $this->announcement->property_id));
        }

        $tenantsQuery->get()
            ->pluck('tenant')
            ->filter()
            ->unique('id')
            ->each(fn ($tenant) => $tenant->notify(new NewAnnouncementNotification($this->announcement)));
    }
}
