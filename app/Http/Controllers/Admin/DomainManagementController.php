<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandlordProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DomainManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/domains', [
            'domains' => LandlordProfile::with(['user', 'domainUsers'])->get()->map(fn ($domain) => [
                'id' => $domain->id,
                'subdomain' => $domain->subdomain,
                'owner' => $domain->user ? $domain->user->name : 'N/A',
                'users_count' => $domain->domainUsers->count(),
                'assigned_users' => $domain->domainUsers->map(fn ($u) => [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->pivot->role,
                ]),
            ]),
            'allUsers' => User::select('id', 'name', 'email')->get(),
        ]);
    }

    public function assignUser(Request $request, LandlordProfile $domain)
    {
        $validated = $request->validate([
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'required|exists:users,id',
            'role' => 'required|string|in:manager,tenant,staff',
        ]);

        // Build key-value array for multi-user pivot sync
        $syncData = [];
        foreach ($validated['user_ids'] as $userId) {
            $syncData[$userId] = ['role' => $validated['role']];
        }

        $domain->domainUsers()->syncWithoutDetaching($syncData);

        return back()->with('success', 'Users attached to domain successfully.');
    }

    public function removeUser(LandlordProfile $domain, User $user)
    {
        $domain->domainUsers()->detach($user->id);

        return back()->with('success', 'User removed from domain.');
    }
}