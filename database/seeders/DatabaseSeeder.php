<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Using WithoutModelEvents to prevent model events from firing during seeding
        // to speed up the process.

        $this->call([
            BranchSeeder::class,
            LevelSeeder::class,
            PackageSeeder::class,
            UserRoleSeeder::class,
            LeadSeeder::class,
        ]);
    }
}
