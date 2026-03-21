<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\MonthlyTarget;
use Illuminate\Database\Seeder;

class MonthlyTargetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branches = Branch::all();
        $currentYear = (int) date('Y');

        if ($branches->isEmpty()) {
            $this->command->warn('Tidak ada data Branch ditemukan. Silakan seed Branch terlebih dahulu.');
            return;
        }

        foreach ($branches as $branch) {
            for ($month = 1; $month <= 12; $month++) {
                MonthlyTarget::updateOrCreate(
                    ['branch_id' => $branch->id, 'month' => $month, 'year' => $currentYear],
                    ['target_enrolled' => rand(15, 60)] // Target acak antara 15 hingga 60 murid per bulan
                );
            }
        }

        $this->command->info('Data MonthlyTarget berhasil di-seed (Tahun: ' . $currentYear . ').');
    }
}
