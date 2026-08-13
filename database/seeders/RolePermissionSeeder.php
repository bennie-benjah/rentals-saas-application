<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Permissions are grouped by domain. Current policies mostly check
     * roles directly (hasRole()) for simplicity, but this permission
     * matrix is what you'd switch policies to check individually once
     * you need finer control — e.g. a "landlord_staff" role that can
     * manage maintenance but not see financials.
     */
    private array $permissions = [
        'properties' => ['view-properties', 'manage-properties'],
        'units' => ['view-units', 'manage-units'],
        'leases' => ['view-leases', 'manage-leases'],
        'invoices' => ['view-invoices', 'manage-invoices'],
        'payments' => ['view-payments'],
        'maintenance' => ['view-maintenance', 'manage-maintenance'],
        'messages' => ['view-messages', 'send-messages'],
        'announcements' => ['view-announcements', 'manage-announcements'],
        'documents' => ['view-own-documents', 'upload-documents', 'review-documents'],
        'platform' => ['manage-users', 'manage-billing', 'view-platform-analytics'],
    ];

    private array $rolePermissions = [
        'admin' => '*', // handled via Gate::before() bypass — see AppServiceProvider snippet
        'reviewer' => ['view-own-documents', 'review-documents'],
        'landlord' => [
            'view-properties', 'manage-properties',
            'view-units', 'manage-units',
            'view-leases', 'manage-leases',
            'view-invoices', 'manage-invoices',
            'view-payments',
            'view-maintenance', 'manage-maintenance',
            'view-messages', 'send-messages',
            'view-announcements', 'manage-announcements',
            'view-own-documents', 'upload-documents',
        ],
        'tenant' => [
            'view-leases',
            'view-invoices',
            'view-payments',
            'view-maintenance',
            'view-messages', 'send-messages',
            'view-announcements',
            'view-own-documents', 'upload-documents',
        ],
    ];

    public function run(): void
    {
        foreach ($this->permissions as $group => $names) {
            foreach ($names as $name) {
                Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
            }
        }

        foreach (array_keys($this->rolePermissions) as $roleName) {
            Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
        }

        foreach ($this->rolePermissions as $roleName => $perms) {
            $role = Role::where('name', $roleName)->first();
            if ($perms === '*') {
                continue; // admin bypasses via Gate::before(), no need to sync every permission
            }
            $role->syncPermissions($perms);
        }
    }
}
