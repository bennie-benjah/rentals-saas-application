<?php

namespace App\Http\Controllers;

use App\Models\LandlordProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    /**
     * Display plan checkout page.
     */
    public function showCheckout(Request $request, string $plan): Response|RedirectResponse
    {
        $allowedPlans = ['starter', 'operator', 'portfolio'];

        if (!in_array($plan, $allowedPlans)) {
            return redirect()->route('pricing.starter');
        }

        return Inertia::render('subscription/checkout', [
            'plan' => $plan,
            'user' => [
                'name'  => $request->user()->name,
                'email' => $request->user()->email,
            ],
        ]);
    }

    /**
     * Check if a requested subdomain is available.
     */
    public function checkSubdomain(Request $request): JsonResponse
    {
        $request->validate([
            'subdomain' => 'required|string|min:3|max:30|regex:/^[a-z0-9\-]+$/i',
        ]);

        $subdomain = Str::lower($request->subdomain);

        // Reserved subdomains list
        $reserved = ['www', 'app', 'admin', 'api', 'mail', 'billing', 'support', 'staging', 'dev'];

        if (in_array($subdomain, $reserved)) {
            return response()->json(['available' => false, 'message' => 'This subdomain is reserved.']);
        }

        $exists = LandlordProfile::where('subdomain', $subdomain)->exists();

        return response()->json([
            'available' => !$exists,
            'message'   => $exists ? 'Subdomain is already taken.' : 'Subdomain is available!',
        ]);
    }

    /**
     * Process checkout request and provision landlord portal.
     */
    public function processCheckout(Request $request): RedirectResponse
    {
        $request->validate([
            'plan'      => 'required|in:starter,operator,portfolio',
            'subdomain' => 'required|string|min:3|max:30|alpha_dash|unique:landlord_profiles,subdomain',
        ]);

        $user = $request->user();
        $subdomain = Str::lower($request->subdomain);

        // Update or create Landlord Profile with subdomain and active plan
        $profile = LandlordProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'subdomain'            => $subdomain,
                'plan'                 => $request->plan,
                'subscription_status'  => 'active',
                'subscription_ends_at' => now()->addMonth(),
            ]
        );

        // Ensure Spatie role is assigned
        if (!$user->hasRole('landlord')) {
            $user->assignRole('landlord');
            $user->account_type = 'landlord';
            $user->save();
        }

        // Construct subdomain portal redirect URL
        $baseDomain = config('app.url_base', 'estateos.test');
        $portalUrl  = "http://{$profile->subdomain}.{$baseDomain}/dashboard";

        return Inertia::location($portalUrl);
    }
}