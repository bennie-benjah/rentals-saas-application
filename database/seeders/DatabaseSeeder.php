<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure Roles Exist (Spatie Permissions)
        $roles = ['admin', 'landlord', 'tenant', 'reviewer'];
        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
        }

        $password = Hash::make('password');

        // ------------------------------------------------------------------
        // Landlord 1: Sunshine Heights (Subdomain: sunshine)
        // ------------------------------------------------------------------
        $landlord1User = User::create([
            'name' => 'Sarah Jenkins',
            'email' => 'sarah@sunshineheights.com',
            'password' => $password,
            'account_type' => 'landlord',
            'email_verified_at' => now(),
        ]);
        $landlord1User->assignRole('landlord');

        DB::table('landlord_profiles')->insert([
            'user_id' => $landlord1User->id,
            'subdomain' => 'sunshine',
            'legal_name' => 'Sunshine Heights Properties Ltd',
            'entity_type' => 'LLC',
            'city' => 'Nairobi',
            'country' => 'Kenya',
            'portfolio_size' => '10-20',
            'plan' => 'operator',
            'subscription_status' => 'active',
            'tos_ack' => true,
            'tax_ack' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $prop1 = DB::table('properties')->insertGetId([
            'landlord_id' => $landlord1User->id,
            'name' => 'Sunshine Modern Apartments',
            'type' => 'Apartment Complex',
            'address' => '12 Kilimani Rd',
            'city' => 'Nairobi',
            'country' => 'Kenya',
            'year_built' => 2022,
            'total_units' => 4,
            'monthly_rent' => 65000,
            'amenities' => json_encode(['High-speed WiFi', 'Gym', '24/7 Security', 'Borehole Water']),
            'image_path' => 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $unit1A = DB::table('units')->insertGetId([
            'property_id' => $prop1,
            'unit_number' => 'A101',
            'bedrooms' => 2,
            'bathrooms' => 2,
            'rent_amount' => 65000,
            'currency' => 'KES',
            'status' => 'occupied',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $unit1B = DB::table('units')->insertGetId([
            'property_id' => $prop1,
            'unit_number' => 'A102',
            'bedrooms' => 3,
            'bathrooms' => 2,
            'rent_amount' => 85000,
            'currency' => 'KES',
            'status' => 'vacant',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Tenant for Sunshine Heights
        $tenant1User = User::create([
            'name' => 'David Kimani',
            'email' => 'david@gmail.com',
            'password' => $password,
            'account_type' => 'tenant',
            'email_verified_at' => now(),
        ]);
        $tenant1User->assignRole('tenant');

        DB::table('tenant_profiles')->insert([
            'user_id' => $tenant1User->id,
            'property_name' => 'Sunshine Modern Apartments',
            'unit_label' => 'A101',
            'employment_status' => 'Employed',
            'employer' => 'Safcom PLC',
            'job_title' => 'Software Engineer',
            'monthly_income' => 250000,
            'bg_consent' => true,
            'deposit_ack' => true,
            'rules_ack' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('leases')->insert([
            'unit_id' => $unit1A,
            'tenant_id' => $tenant1User->id,
            'landlord_id' => $landlord1User->id,
            'start_date' => now()->subMonths(3)->toDateString(),
            'end_date' => now()->addMonths(9)->toDateString(),
            'rent_amount' => 65000,
            'currency' => 'KES',
            'billing_cycle' => 'monthly',
            'billing_day' => 1,
            'deposit_amount' => 65000,
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        // ------------------------------------------------------------------
        // Landlord 2: Apex Luxury Living (Subdomain: apex)
        // ------------------------------------------------------------------
        $landlord2User = User::create([
            'name' => 'Apex Realty Ltd',
            'email' => 'management@apexliving.co.ke',
            'password' => $password,
            'account_type' => 'landlord',
            'email_verified_at' => now(),
        ]);
        $landlord2User->assignRole('landlord');

        DB::table('landlord_profiles')->insert([
            'user_id' => $landlord2User->id,
            'subdomain' => 'apex',
            'legal_name' => 'Apex Living Real Estate Group',
            'entity_type' => 'Corporation',
            'city' => 'Nairobi',
            'country' => 'Kenya',
            'portfolio_size' => '50+',
            'plan' => 'portfolio',
            'subscription_status' => 'active',
            'tos_ack' => true,
            'tax_ack' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('properties')->insert([
            'landlord_id' => $landlord2User->id,
            'name' => 'Apex Penthouse & Suites',
            'type' => 'Luxury Towers',
            'address' => '45 Westlands Rd',
            'city' => 'Nairobi',
            'country' => 'Kenya',
            'year_built' => 2023,
            'total_units' => 10,
            'monthly_rent' => 120000,
            'amenities' => json_encode(['Rooftop Pool', 'Concierge', 'Underground Parking', 'Gym']),
            'image_path' => 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('properties')->insert([
            'landlord_id' => $landlord2User->id,
            'name' => 'Apex Urban Lofts',
            'type' => 'Studio Apartments',
            'address' => '88 Riverside Dr',
            'city' => 'Nairobi',
            'country' => 'Kenya',
            'year_built' => 2021,
            'total_units' => 6,
            'monthly_rent' => 45000,
            'amenities' => json_encode(['High Speed Internet', 'Backup Generator']),
            'image_path' => 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        // ------------------------------------------------------------------
        // Landlord 3: Green Valley Estates (Subdomain: greenvalley)
        // ------------------------------------------------------------------
        $landlord3User = User::create([
            'name' => 'John Mwangi',
            'email' => 'john@greenvalley.co.ke',
            'password' => $password,
            'account_type' => 'landlord',
            'email_verified_at' => now(),
        ]);
        $landlord3User->assignRole('landlord');

        DB::table('landlord_profiles')->insert([
            'user_id' => $landlord3User->id,
            'subdomain' => 'greenvalley',
            'legal_name' => 'Green Valley Homes',
            'entity_type' => 'Individual',
            'city' => 'Kiambu',
            'country' => 'Kenya',
            'portfolio_size' => '1-5',
            'plan' => 'starter',
            'subscription_status' => 'active',
            'tos_ack' => true,
            'tax_ack' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('properties')->insert([
            'landlord_id' => $landlord3User->id,
            'name' => 'Green Valley Gardens',
            'type' => 'Townhouses',
            'address' => '102 Ruiru Bypass',
            'city' => 'Kiambu',
            'country' => 'Kenya',
            'year_built' => 2020,
            'total_units' => 3,
            'monthly_rent' => 50000,
            'amenities' => json_encode(['Private Garden', 'Gated Community', 'Solar Heating']),
            'image_path' => 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}