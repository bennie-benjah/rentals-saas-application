<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        Plan::updateOrCreate(
            ['slug' => 'starter'],
            [
                'name' => 'Starter',
                'tagline' => 'For independent landlords just getting organized.',
                'price' => '$2',
                'unit' => '/unit/mo',
                'cta' => 'Start with Starter',
                'featured' => false,
                'features' => [
                    'Up to 25 units',
                    'Maintenance kanban board',
                    'Tenant portal access',
                    'Card & ACH rent collection',
                    'Email support',
                ],
                'includes' => [
                    ['t' => 'Live dashboard', 'd' => 'Occupancy, revenue and ticket volume at a glance.'],
                    ['t' => 'Tenant onboarding', 'd' => 'Multi-step forms to invite and verify tenants.'],
                    ['t' => 'Document storage', 'd' => 'Centralized lease and document repository.'],
                ],
                'not_included' => [
                    'M-Pesa payments',
                    'Real-time messaging',
                    'SSO & SCIM',
                    'Custom reporting',
                ],
            ]
        );

        Plan::updateOrCreate(
            ['slug' => 'operator'],
            [
                'name' => 'Operator',
                'tagline' => 'The plan most portfolio leads pick. Unlimited units, every payment rail, and a calm inbox.',
                'price' => '$4',
                'unit' => '/unit/mo',
                'cta' => 'Choose Operator',
                'featured' => true,
                'features' => [
                    'Unlimited units',
                    'M-Pesa & ACH payouts',
                    'Real-time landlord–tenant messaging',
                    'Maintenance kanban with photo uploads',
                    'Financial reporting & exports',
                    'Priority email & chat support',
                ],
                'includes' => [
                    ['t' => 'Every payment rail', 'd' => 'Card, ACH and M-Pesa — auto-reconciled to units.'],
                    ['t' => 'Unified inbox', 'd' => 'One real-time stream for every tenant conversation.'],
                    ['t' => 'Operator analytics', 'd' => 'Yield, vacancy and arrears in interactive charts.'],
                ],
                'not_included' => [
                    'SSO & SCIM',
                    'Custom reporting',
                    'Dedicated CSM',
                ],
            ]
        );

        Plan::updateOrCreate(
            ['slug' => 'portfolio'],
            [
                'name' => 'Portfolio',
                'tagline' => 'For institutional operators running thousands of units across regions.',
                'price' => 'Custom',
                'unit' => '',
                'cta' => 'Talk to sales',
                'featured' => false,
                'features' => [
                    'Everything in Operator',
                    'SSO (SAML, OIDC) & SCIM provisioning',
                    'Custom reporting & data warehouse sync',
                    'Dedicated Customer Success Manager',
                    '99.95% SLA & private support channel',
                    'Onboarding & migration assistance',
                ],
                'includes' => [
                    ['t' => 'Enterprise identity', 'd' => 'SAML, OIDC and SCIM — provision teams in seconds.'],
                    ['t' => 'Data you own', 'd' => 'Warehouse sync to BigQuery, Snowflake or Redshift.'],
                    ['t' => 'White-glove onboarding', 'd' => 'A dedicated CSM migrates your data and trains your team.'],
                ],
                'not_included' => [],
            ]
        );
    }
}
