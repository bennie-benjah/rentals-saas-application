<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();

        // Redirect Tenants directly to their portal, ignoring any saved intended URL
        if ($user->hasRole('tenant')) {
            // Forget previously attempted URL (which was likely /dashboard)
            session()->forget('url.intended');
            return redirect()->route('tenant.index');
        }

        // Redirect Admins / Reviewers / Landlords
        if ($user->hasRole('admin') || $user->hasRole('reviewer')) {
            return redirect()->intended(route('dashboard'));
        }

        return redirect()->intended(route('dashboard'));
    }
}
