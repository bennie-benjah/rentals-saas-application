<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionController extends Controller
{
    /**
     * Display the Role & Permission Management page.
     */
    public function index()
    {
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all()->groupBy(function ($permission) {
            // Optional: Group permissions by feature module (e.g. "properties.view" -> "properties")
            return explode('.', $permission->name)[0] ?? 'general';
        });

        return Inertia::render('dashboard/roles-permissions', [
            'roles' => $roles,
            'groupedPermissions' => $permissions,
        ]);
    }

    /**
     * Sync permissions for a specific role.
     */
    public function updateRolePermissions(Request $request, Role $role)
    {
        $request->validate([
            'permissions' => ['array'],
            'permissions.*' => ['string', 'exists:permissions,name'],
        ]);

        // Spatie's method to replace existing permissions with new list
        $role->syncPermissions($request->input('permissions', []));

        // Reset Spatie permission cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        return back()->with('success', "Permissions for {$role->name} updated successfully.");
    }
}