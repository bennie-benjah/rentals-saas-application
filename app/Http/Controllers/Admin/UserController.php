<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashboard/users', [
            'users' => User::with('roles')->paginate(15)->through(fn ($user) => [
                'id'           => $user->id,
                'name'         => $user->name,
                'email'        => $user->email,
                'account_type' => $user->account_type,
                'roles'        => $user->getRoleNames(),
                'created_at'   => $user->created_at->format('Y-m-d'),
            ]),
            'availableRoles' => Role::pluck('name'),
        ]);
    }

    public function updateRoles(Request $request, User $user)
{
    $request->validate([
        'roles'   => 'required|array',
        'roles.*' => 'exists:roles,name',
    ]);

    // 1. Sync Spatie roles
    $user->syncRoles($request->roles);

    // 2. Explicitly update account_type on the user model
    $selectedRole = $request->roles[0] ?? null;

    if ($selectedRole) {
        $user->account_type = $selectedRole;
        $user->save();
    }

    return back()->with('status', 'user-roles-updated');
}
}