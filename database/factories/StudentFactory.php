<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'lead_id' => \App\Models\Lead::factory(),
            'nis' => fake()->unique()->numerify('ST-####-####'),
            'status' => fake()->randomElement(['active', 'graduated', 'dropout']),
        ];
    }
}
