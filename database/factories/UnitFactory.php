<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

class UnitFactory extends Factory
{
    protected $model = Unit::class;

    public function definition(): array
    {
        return [
            'property_id' => Property::factory(),
            'unit_number' => strtoupper(fake()->bothify('?##')),
            'bedrooms' => fake()->numberBetween(1, 4),
            'bathrooms' => fake()->numberBetween(1, 3),
            'rent_amount' => fake()->numberBetween(15000, 90000),
            'currency' => 'KES',
            'status' => fake()->randomElement(['vacant', 'occupied', 'occupied', 'occupied', 'maintenance']),
        ];
    }
}
