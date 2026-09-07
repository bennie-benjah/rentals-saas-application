<?php

namespace Database\Seeders;

use App\Models\Lease;
use App\Models\Property;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Local/dev-only sample data. Do NOT run this against production —
 * guard it behind an environment check if you add it to DatabaseSeeder's
 * default run, or call it explicitly:
 *   php artisan db:seed --class=Database\\Seeders\\DemoDataSeeder
 */
class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->environment('production')) {
            $this->command->warn('Skipping demo data — refusing to run in production.');

            return;
        }


        $landlord = User::factory()->create([
            'name' => 'Benjamin Mutula',
            'email' => 'landlord@estateos.test',
            'account_type' => 'landlord',
            'email_verified_at' => now(),
        ]);
        $landlord->assignRole('landlord');

        $property = Property::factory()->create([
            'landlord_id' => $landlord->id,
            'name' => 'Greenview Apartments',
            'city' => 'Nairobi',
        ]);

        $units = Unit::factory()->count(6)->create(['property_id' => $property->id]);

        foreach ($units->take(4) as $unit) {
            $tenant = User::factory()->create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'account_type' => 'tenant',
                'email_verified_at' => now(),
            ]);
            $tenant->assignRole('tenant');

            $unit->update(['status' => 'occupied']);

            Lease::factory()->create([
                'unit_id' => $unit->id,
                'tenant_id' => $tenant->id,
                'landlord_id' => $landlord->id,
                'rent_amount' => $unit->rent_amount,
            ]);
        }

        $this->command->info('Demo data seeded: 1 admin, 1 landlord, 1 property (6 units), 4 tenants with active leases.');
        $this->command->info('Login as landlord@estateos.test or any generated tenant email — check password via tinker if needed (factory default is "password").');
    }
}
