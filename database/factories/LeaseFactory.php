<?php

namespace Database\Factories;

use App\Models\Lease;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeaseFactory extends Factory
{
    protected $model = Lease::class;

    public function definition(): array
    {
        return [
            'unit_id' => Unit::factory(),
            'tenant_id' => User::factory(),
            'landlord_id' => User::factory(),
            'start_date' => fake()->dateTimeBetween('-1 year', 'now'),
            'rent_amount' => fake()->numberBetween(15000, 90000),
            'currency' => 'KES',
            'billing_cycle' => 'monthly',
            'billing_day' => fake()->numberBetween(1, 5),
            'deposit_amount' => fake()->numberBetween(15000, 90000),
            'status' => 'active',
        ];
    }
}
