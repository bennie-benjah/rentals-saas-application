<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return $this->redirectBasedOnRole($user);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return $this->redirectBasedOnRole($user);
    }

    protected function redirectBasedOnRole($user): RedirectResponse
    {
        // 1. If user already has a role assigned or account_type set
        if ($user->roles()->exists() || $user->account_type) {
            if ($user->account_type === 'tenant' || $user->hasRole('tenant')) {
                return redirect()->intended(route('tenant.index', absolute: false) . '?verified=1');
            }

            return redirect()->intended(route('dashboard', absolute: false) . '?verified=1');
        }

        // 2. Clear cached /dashboard URL from session memory
        session()->forget('url.intended');

        // 3. Force direct route to onboarding
        return redirect()->route('onboarding.role', ['verified' => 1]);
    }
}