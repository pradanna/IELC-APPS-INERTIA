<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Package>
 */
class PackageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sessions = fake()->numberBetween(12, 48);
        $pricePerSession = fake()->randomElement([50000, 75000, 100000]);

        return [
            'name' => 'Paket ' . fake()->words(2, true),
            'type' => fake()->randomElement(['group', 'private', 'semi-private']),
            'sessions_count' => $sessions,
            'price' => $sessions * $pricePerSession,
            'is_active' => true,
        ];
    }
}
