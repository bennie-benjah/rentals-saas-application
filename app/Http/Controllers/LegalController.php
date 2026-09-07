<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LegalController extends Controller
{
    public function terms(): Response
    {
        return Inertia::render('legal/terms');
    }

    public function privacy(): Response
    {
        return Inertia::render('legal/privacy');
    }

    public function cookies(): Response
    {
        return Inertia::render('legal/cookies');
    }

    public function dpa(): Response
    {
        return Inertia::render('legal/dpa');
    }

    public function security(): Response
    {
        return Inertia::render('legal/security');
    }
}