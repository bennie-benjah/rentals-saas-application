<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the welcome/landing page with pricing plans.
     */
    public function __invoke(Request $request): Response
    {
        return Inertia::render('welcome', [
            'plans' => Plan::all()->map(fn ($plan) => [
                'id' => $plan->slug,
                'href' => "/pricing/{$plan->slug}",
                'name' => $plan->name,
                'tagline' => $plan->tagline,
                'price' => $plan->price,
                'unit' => $plan->unit ?? '',
                'cta' => $plan->cta ?? 'View plan',
                'featured' => (bool) $plan->featured,
                'features' => $plan->features ?? [],
                'includes' => $plan->includes ?? [],
                'not_included' => $plan->not_included ?? [],
            ]),
            'auth' => [
                'user' => $request->user(),
            ],
        ]);
    }
}
