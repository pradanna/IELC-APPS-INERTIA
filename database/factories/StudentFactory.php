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
            'name' => fake()->name(),
            'dob' => fake()->dateTimeBetween('-20 years', '-7 years'),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'parent_name' => fake()->name('female'),
            'parent_phone' => fake()->phoneNumber(),
        ];
    }
}
