<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lead>
 */
class LeadFactory extends Factory
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
            'email' => fake()->unique()->safeEmail(),
            'address' => fake()->address(),
            'parent_name' => fake()->name('female'),
            'parent_phone' => fake()->phoneNumber(),
            'lead_source_id' => \App\Models\LeadSource::factory(),
            'lead_status_id' => 'c0a80101-0000-0000-0000-000000000001',
            'notes' => fake()->sentence(),
        ];
    }
}
