<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PricingController extends Controller
{
    /**
     * Display the landing/welcome page with all plans.
     */
    public function index(): Response
    {
        return Inertia::render('welcome', [
            'plans' => Plan::all(),
        ]);
    }

    /**
     * Display a specific pricing plan dynamically by slug.
     */
    public function show(Request $request, string $slug): Response
    {
        $plan = Plan::where('slug', $slug)->firstOrFail();

        return Inertia::render("pricing/{$slug}", [
            'plan' => $plan,
            'currentPlan' => $request->user()?->plan ?? null,
        ]);
    }

    /**
     * Individual plan alias methods (delegates directly to show).
     */
    public function starter(Request $request): Response
    {
        return $this->show($request, 'starter');
    }

    public function operator(Request $request): Response
    {
        return $this->show($request, 'operator');
    }

    public function portfolio(Request $request): Response
    {
        return $this->show($request, 'portfolio');
    }

    /**
     * Handle Plan Upgrades/Changes.
     */
    public function subscribe(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'plan' => 'required|string|exists:plans,slug',
        ]);

        $user = $request->user();

        // Update the user's direct relationship/column
        $user->update([
            'plan_id' => Plan::where('slug', $validated['plan'])->value('id'),
        ]);

        return redirect()->route('dashboard')->with('success', "Subscribed to the {$validated['plan']} plan!");
    }
}