<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    public function show(string $slug): Response
    {
        $plan = Plan::where('slug', $slug)->firstOrFail();

        return Inertia::render('Pricing/Show', [
            'plan' => $plan,
        ]);
    }
}