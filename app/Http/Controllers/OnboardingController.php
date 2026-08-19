<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class OnboardingController extends Controller
{
    public function showRoleSelection(Request $request)
    {
        if ($request->user()->roles()->exists()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('register/choose');
    }

    public function setRole(Request $request)
    {
        $request->validate([
            'role' => 'required|in:tenant,landlord',
        ]);

        $user = $request->user();
        
        Role::firstOrCreate(['name' => $request->role, 'guard_name' => 'web']);
        
        $user->account_type = $request->role;
        $user->save();
        $user->assignRole($request->role);

        return $request->role === 'landlord'
            ? redirect()->route('dashboard')
            : redirect()->route('tenant.index');
    }
}