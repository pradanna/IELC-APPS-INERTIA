<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $levels = [
            ['name' => 'Kids 1', 'description' => 'Beginner level for young children.'],
            ['name' => 'Kids 2', 'description' => 'Intermediate level for young children.'],
            ['name' => 'Teens 1', 'description' => 'Beginner level for teenagers.'],
            ['name' => 'Teens 2', 'description' => 'Intermediate level for teenagers.'],
            ['name' => 'General English - Elementary', 'description' => 'For adult beginners.'],
            ['name' => 'General English - Intermediate', 'description' => 'For adults with basic knowledge.'],
            ['name' => 'General English - Advanced', 'description' => 'For adults aiming for fluency.'],
            ['name' => 'TOEFL Preparation', 'description' => 'Intensive course for the TOEFL exam.'],
            ['name' => 'IELTS Preparation', 'description' => 'Intensive course for the IELTS exam.'],
            ['name' => 'Business English', 'description' => 'English for professional communication.'],
        ];

        foreach ($levels as $level) {
            Level::create($level);
        }
    }
}
