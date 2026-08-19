<?php

namespace App\Http\Middleware;

use App\Models\LandlordProfile;
use App\Models\TenantProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;
use Spatie\Honeypot\Honeypot;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $honeypot = app(Honeypot::class);
        $user     = $request->user();

        $roles           = $user ? $user->getRoleNames()->toArray() : [];
        $landlordProfile = null;
        $tenantProfile   = null;

        if ($user) {
            // Retrieve Landlord Profile if user has landlord role or landlord account type
            if (in_array('landlord', $roles) || $user->account_type === 'landlord') {
                $landlordProfile = LandlordProfile::where('user_id', $user->id)
                    ->orWhere('paypal_email', $user->email)
                    ->first();
            }

            // Retrieve Tenant Profile if user has tenant role or tenant account type
            if (in_array('tenant', $roles) || $user->account_type === 'tenant') {
                $tenantProfile = TenantProfile::where('user_id', $user->id)
                    ->first();
            }
        }

        $accountType = $user
            ? ($user->account_type ?? (in_array('landlord', $roles) ? 'landlord' : (in_array('tenant', $roles) ? 'tenant' : null)))
            : null;

        return [
            'honeypot' => [
                'enabled'            => config('honeypot.enabled'),
                'nameFieldName'      => config('honeypot.name_field_name'),
                'validFromFieldName' => config('honeypot.valid_from_field_name'),
                'validFrom'          => $honeypot->validFrom(),
            ],
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? array_merge($user->toArray(), [
                    'roles'            => $roles,
                    'permissions'      => $user->getAllPermissions()->pluck('name')->toArray(),
                    'account_type'     => $accountType,
                    'profileCompleted' => match (true) {
                        in_array('landlord', $roles) && in_array('tenant', $roles) => (bool) $landlordProfile && (bool) $tenantProfile,
                        in_array('landlord', $roles) => (bool) $landlordProfile,
                        in_array('tenant', $roles)   => (bool) $tenantProfile,
                        default                      => true,
                    },
                ]) : null,
            ],
            'profileData' => $user ? [
                'account_type' => $accountType,
                'landlord'     => $landlordProfile?->toArray(),
                'tenant'       => $tenantProfile?->toArray(),
            ] : null,

            'notifications' => ($user && Schema::hasTable('notifications'))
                ? $user->unreadNotifications->map(fn($n) => [
                    'id'      => $n->id,
                    'title'   => $n->data['title'] ?? 'Notification',
                    'message' => $n->data['message'] ?? '',
                    'time'    => $n->created_at->diffForHumans(),
                    'read'    => ! is_null($n->read_at),
                    'type'    => $n->data['type'] ?? 'info',
                    'roles'   => $n->data['roles'] ?? [],
                ])
                : [],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}