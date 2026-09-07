<?php

namespace Database\Seeders;

use App\Models\LandlordProfile;
use App\Models\Subdomain;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SubdomainSeeder extends Seeder
{
    public function run(): void
    {
        $subdomainsData = [
            [
                'subdomain' => 'sunshine.127.0.0.1.nip.io',
                'owner' => 'Sarah Jenkins',
                'owner_email' => 'sarah.jenkins@example.com',
                'users' => [
                    ['name' => 'David Kimani', 'email' => 'david@gmail.com', 'role' => 'tenant'],
                    ['name' => 'Benjamin Mutula', 'email' => 'mutulabenjamin299@gmail.com', 'role' => 'tenant'],
                ],
            ],
            [
                'subdomain' => 'apex.127.0.0.1.nip.io',
                'owner' => 'Apex Realty Ltd',
                'owner_email' => 'contact@apexrealty.com',
                'users' => [],
            ],
            [
                'subdomain' => 'greenvalley.127.0.0.1.nip.io',
                'owner' => 'John Mwangi',
                'owner_email' => 'john.mwangi@example.com',
                'users' => [],
            ],
            [
                'subdomain' => '.127.0.0.1.nip.io',
                'owner' => 'Leo Landlord',
                'owner_email' => 'leo.landlord@example.com',
                'users' => [],
            ],
        ];

        foreach ($subdomainsData as $data) {
            $subdomainSlug = Str::before($data['subdomain'], '.127.0.0.1.nip.io');
            $subdomainSlug = ! empty($subdomainSlug) ? $subdomainSlug : 'main';

            // 1. Create or retrieve the Landlord User
            $ownerUser = User::firstOrCreate(
                ['email' => $data['owner_email']],
                [
                    'name' => $data['owner'],
                    'password' => bcrypt('password'),
                    'account_type' => 'landlord',
                ]
            );

            // 2. Safely update or create the Landlord Profile matching the subdomain slug
            $landlord = LandlordProfile::updateOrCreate(
                ['subdomain' => $subdomainSlug],
                [
                    'user_id' => $ownerUser->id,
                    'legal_name' => $data['owner'],
                    'owner_type' => 'individual',
                ]
            );

            // 3. Create/update Subdomain mapping
            Subdomain::updateOrCreate(
                ['subdomain' => $data['subdomain']],
                ['landlord_profile_id' => $landlord->id]
            );

            // 4. Attach assigned tenant/staff users
            foreach ($data['users'] as $userData) {
                $tenantUser = User::firstOrCreate(
                    ['email' => $userData['email']],
                    [
                        'name' => $userData['name'],
                        'password' => bcrypt('password'),
                        'account_type' => 'tenant',
                    ]
                );

                $landlord->domainUsers()->syncWithoutDetaching([
                    $tenantUser->id => ['role' => $userData['role']],
                ]);
            }
        }
    }
}