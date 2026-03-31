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
        $branchId = \App\Models\Branch::pluck('id')->random() ?? \App\Models\Branch::factory();

        return [
            'user_id' => \App\Models\User::factory()->state(['role' => 'student']),
            'lead_id' => \App\Models\Lead::factory()->state(['branch_id' => $branchId]),
            'nis' => fake()->unique()->numerify('11200####'),
            'status' => 'active',
        ];
    }
}
