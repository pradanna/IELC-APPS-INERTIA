<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Lead;
use App\Models\LeadStatus;
use App\Models\Level;
use App\Models\Package;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LeadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branches = Branch::all();
        $levels = Level::all();
        $packages = Package::all();
        $statuses = LeadStatus::all();
        $sources = \App\Models\LeadSource::all();

        if ($branches->isEmpty() || $levels->isEmpty() || $packages->isEmpty() || $statuses->isEmpty() || $sources->isEmpty()) {
            $this->command->warn('Branches, Levels, Packages, Lead Statuses or Lead Sources not found. Skipping LeadSeeder.');
            return;
        }

        for ($i = 0; $i < 150; $i++) {
            Lead::factory()->create([
                'branch_id' => $branches->random()->id,
                'interest_level_id' => $levels->random()->id,
                'interest_package_id' => $packages->random()->id,
                'lead_status_id' => $statuses->random()->id,
                'lead_source_id' => $sources->random()->id,
            ]);
        }
    }
}
