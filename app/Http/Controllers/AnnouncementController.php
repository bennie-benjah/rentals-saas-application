<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAnnouncementRequest;
use App\Jobs\NotifyTenantsOfAnnouncement;
use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $announcements = Announcement::with('property:id,name')
            ->when($user->hasRole('landlord'), fn ($q) => $q->where('landlord_id', $user->id))
            ->when($user->hasRole('tenant'), function ($q) use ($user) {
                // Tenant sees announcements for their landlord(s) — either
                // platform-wide (property_id null) or scoped to their unit's property.
                $landlordIds = $user->leasesAsTenant()->pluck('landlord_id');
                $propertyIds = $user->leasesAsTenant()->with('unit')->get()->pluck('unit.property_id');
                $q->whereIn('landlord_id', $landlordIds)
                    ->where(fn ($q2) => $q2->whereNull('property_id')->orWhereIn('property_id', $propertyIds));
            })
            ->latest()
            ->get();

        return response()->json($announcements);
    }

    public function store(StoreAnnouncementRequest $request)
    {
        $announcement = Announcement::create([
            ...$request->validated(),
            'landlord_id' => $request->user()->id,
        ]);

        NotifyTenantsOfAnnouncement::dispatch($announcement);

        return back()->with('success', 'Announcement sent.')->with('announcement', $announcement);
    }

    public function destroy(Announcement $announcement)
    {
        $this->authorize('delete', $announcement);
        $announcement->delete();

        return back()->with('success', 'Announcement removed.');
    }
}
