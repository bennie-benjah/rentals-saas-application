<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PricingController extends Controller
{
    /**
     * Display the Starter Plan page.
     */
    public function starter(Request $request): Response
    {
        return Inertia::render('pricing/starter', [
            'currentPlan' => $request->user()?->plan ?? null,
        ]);
    }

    /**
     * Display the Operator Plan page.
     */
    public function operator(Request $request): Response
    {
        return Inertia::render('pricing/operator', [
            'currentPlan' => $request->user()?->plan ?? null,
        ]);
    }

    /**
     * Display the Portfolio Plan page.
     */
    public function portfolio(Request $request): Response
    {
        return Inertia::render('pricing/portfolio', [
            'currentPlan' => $request->user()?->plan ?? null,
        ]);
    }

    /**
     * Handle Plan Upgrades/Changes.
     */
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'plan' => 'required|string|in:starter,operator,portfolio',
        ]);

        $user = $request->user();

        // Update user plan (or trigger Stripe/Payment Gateway checkout session)
        $user->update([
            'plan' => $validated['plan'],
        ]);

        return redirect()->route('dashboard')->with('success', "Subscribed to the {$validated['plan']} plan!");
    }
}