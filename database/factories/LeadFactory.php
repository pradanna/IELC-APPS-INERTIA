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
            'lead_status_id' => '0ca51d27-0466-41fa-9cd0-02e0b57e7fc0',
            'notes' => fake()->sentence(),
        ];
    }
}
