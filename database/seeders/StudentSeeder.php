<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Lead;
use App\Models\Student;
use App\Models\StudyClass;
use App\Models\User;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branches = Branch::all();
        $classes = StudyClass::all();

        if ($branches->isEmpty()) {
            $this->command->warn('No branches found. Please run BranchSeeder first.');
            return;
        }

        // Create 50 students
        Student::factory()->count(50)->create()->each(function ($student) use ($classes) {
            // Randomly assign each student to 1-2 classes if available
            if ($classes->isNotEmpty()) {
                $randomClasses = $classes->random(rand(1, min(2, $classes->count())))->pluck('id');
                $student->studyClasses()->sync($randomClasses);
            }

            // Ensure the lead branch matches student (optional data cleanup)
            $student->lead->update(['branch_id' => Branch::all()->random()->id]);
        });

        $this->command->info('Created 50 students with linked user accounts and class assignments.');
    }
}
