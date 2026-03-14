<?php

namespace Database\Seeders;

use App\Models\Level;
use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $levels = Level::all();

        if ($levels->isEmpty()) {
            $this->command->warn('No levels found. Skipping PackageSeeder.');
            return;
        }

        for ($i = 0; $i < 15; $i++) {
            Package::factory()->create([
                'level_id' => $levels->random()->id,
            ]);
        }
    }
}
