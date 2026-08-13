<?php

namespace Database\Seeders;

use App\Models\LandlordProfile;
use App\Models\TenantProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Creates one user per role with predictable credentials, so you can log
 * in as each and click through their dashboard without hunting through
 * factory-generated data. Password for all four is "password".
 *
 * Requires RolePermissionSeeder to have already run (roles must exist
 * before assignRole() will work).
 *
 * Run directly with:
 *   php artisan db:seed --class=Database\\Seeders\\RoleTestUsersSeeder
 */
class RoleTestUsersSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->environment('production')) {
            $this->command->warn('Skipping — refusing to seed test accounts in production.');

            return;
        }

        $admin = User::updateOrCreate(
            ['email' => 'admin@estateos.test'],
            [
                'name' => 'Ava Admin',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $admin->syncRoles(['admin']);

        $reviewer = User::updateOrCreate(
            ['email' => 'reviewer@estateos.test'],
            [
                'name' => 'Rita Reviewer',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        $reviewer->syncRoles(['reviewer']);

        $landlord = User::updateOrCreate(
            ['email' => 'landlord@estateos.test'],
            [
                'name' => 'Leo Landlord',
                'password' => 'password',
                'account_type' => 'landlord',
                'email_verified_at' => now(),
            ]
        );
        $landlord->syncRoles(['landlord']);

        LandlordProfile::updateOrCreate(
            ['user_id' => $landlord->id],
            [
                'owner_type' => 'individual',
                'city' => 'Nairobi',
                'country' => 'Kenya',
                'payout_method' => 'mpesa',
                'currency' => 'KES',
                'tos_ack' => true,
            ]
        );

        $tenant = User::updateOrCreate(
            ['email' => 'tenant@estateos.test'],
            [
                'name' => 'Tia Tenant',
                'password' => 'password',
                'account_type' => 'tenant',
                'email_verified_at' => now(),
            ]
        );
        $tenant->syncRoles(['tenant']);

        TenantProfile::updateOrCreate(
            ['user_id' => $tenant->id],
            [
                'nationality' => 'Kenyan',
                'employment_status' => 'employed',
                'bg_consent' => true,
                'deposit_ack' => true,
                'rules_ack' => true,
            ]
        );

        $this->command->table(
            ['Role', 'Email', 'Password'],
            [
                ['admin', $admin->email, 'password'],
                ['reviewer', $reviewer->email, 'password'],
                ['landlord', $landlord->email, 'password'],
                ['tenant', $tenant->email, 'password'],
            ]
        );
    }
}
