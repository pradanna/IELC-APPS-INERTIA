<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Branch::create([
            'name' => 'Solo',
            'phone' => '0271-123456',
            'address' => 'Jl. Slamet Riyadi No. 1, Solo',
        ]);

        Branch::create([
            'name' => 'Semarang',
            'phone' => '024-654321',
            'address' => 'Jl. Pahlawan No. 10, Semarang',
        ]);
    }
}
