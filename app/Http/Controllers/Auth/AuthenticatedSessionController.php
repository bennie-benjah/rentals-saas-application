<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\LandlordProfile;
use App\Models\Lease;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(Request $request): Response
    {
        // Ensure the CSRF cookie is attached to the response for the subdomain
        return Inertia::render('auth/login', [
            'status' => session('status'),
        ])->withCookie(cookie(
            'XSRF-TOKEN',
            $request->session()->token(),
            0,
            '/',
            '.127.0.0.1.nip.io',
            false,
            false // httpOnly must be false so JS/Axios can read it
        ));
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // 1. Authenticate standard credentials (email & password)
        $request->authenticate();

        $user = Auth::user();

        // 2. Strict active account validation (1 = active, 0 = deactivated)
        if ((int) $user->is_active !== 1) {
            $this->logoutAndReject($request, 'Your account has been deactivated due to suspicious activity.');
        }

        $host = $request->getHost(); // e.g., "apex.127.0.0.1.nip.io"
        $baseDomain = config('app.url_base', env('APP_URL_BASE', '127.0.0.1.nip.io'));

        // 3. Subdomain Validation
        if (Str::contains($host, '.' . $baseDomain)) {
            $subdomain = Str::before($host, '.' . $baseDomain);

            $landlordProfile = LandlordProfile::where('subdomain', $subdomain)->first();

            if ($landlordProfile) {
                $landlordUserId = $landlordProfile->user_id;

                // Case A: Landlord logging into someone else's portal
                if ($user->account_type === 'landlord' && $user->id !== $landlordUserId) {
                    $this->logoutAndReject($request, 'You do not have administrative access to this portal.');
                }

                // Case B: Tenant logging into a portal where they have no active lease
                if ($user->account_type === 'tenant') {
                    $hasLeaseWithLandlord = Lease::where('tenant_id', $user->id)
                        ->where('landlord_id', $landlordUserId)
                        ->exists();

                    if (! $hasLeaseWithLandlord) {
                        $this->logoutAndReject($request, 'No active tenancy found under this property manager.');
                    }
                }
            }
        }

        // 4. Prevent Session Fixation
        $request->session()->regenerate();

        // 5. Onboarding & Role-based Redirection
        if (! $user->roles()->exists() && ! $user->account_type) {
            $request->session()->forget('url.intended');
            return redirect()->route('onboarding.role');
        }

        if ($user->account_type === 'tenant' || $user->hasRole('tenant')) {
            return redirect()->route('tenant.index');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Helper to log out and throw a validation error.
     */
    protected function logoutAndReject(Request $request, string $message): void
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        throw ValidationException::withMessages([
            'email' => $message,
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}