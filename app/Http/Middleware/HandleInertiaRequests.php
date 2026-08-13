<?php
namespace App\Http\Middleware;
use Illuminate\Support\Facades\Schema;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Spatie\Honeypot\Honeypot;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $honeypot = app(Honeypot::class);
        $user     = $request->user();

        return [
            'honeypot'      => [
                'enabled'            => config('honeypot.enabled'),
                'nameFieldName'      => config('honeypot.name_field_name'),
                'validFromFieldName' => config('honeypot.valid_from_field_name'),
                'validFrom'          => $honeypot->validFrom(),
            ],
            ...parent::share($request),
            'name'          => config('app.name'),
            'auth'          => [
                'user' => $user ? array_merge($user->toArray(), [
                    'roles'       => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ]) : null,
            ],
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
            'sidebarOpen'   => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
