<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all branches to ensure rooms are assigned to existing branches
        $branches = Branch::all();

        if ($branches->isEmpty()) {
            return;
        }

        foreach ($branches as $branch) {
            for ($i = 1; $i <= 12; $i++) {
                // Check if already exists to avoid duplication
                Room::updateOrCreate(
                    [
                        'branch_id' => $branch->id,
                        'name' => "Room $i",
                    ],
                    [
                        'capacity' => 10,
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
