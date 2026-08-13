<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyFactory extends Factory
{
    protected $model = Property::class;

    public function definition(): array
    {
        return [
            'landlord_id' => User::factory(),
            'name' => fake()->streetName().' '.fake()->randomElement(['Apartments', 'Heights', 'Court', 'Residences']),
            'type' => fake()->randomElement(['apartment', 'standalone', 'commercial']),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'country' => 'Kenya',
            'year_built' => fake()->numberBetween(1995, 2024),
            'total_units' => fake()->numberBetween(4, 40),
            'monthly_rent' => fake()->numberBetween(15000, 120000),
            'amenities' => fake()->randomElements(['Parking', 'Elevator', 'Gym', 'Pool', 'Laundry', 'Security', 'Wi-Fi', 'Backup power'], 3),
        ];
    }
}
