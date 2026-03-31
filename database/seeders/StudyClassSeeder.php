<?php

namespace Database\Seeders;

use App\Models\StudyClass;
use App\Models\Package;
use Illuminate\Database\Seeder;

class StudyClassSeeder extends Seeder
{
    public function run()
    {
        $packages = Package::with('level')->get();
        $branches = \App\Models\Branch::all();

        if ($branches->isEmpty()) {
            return;
        }

        // Vibrant, saturated color palette (Tailwind 500 range)
        $vibrantColors = [
            '#10b981', // emerald-500
            '#3b82f6', // blue-500
            '#f43f5e', // rose-500
            '#f59e0b', // amber-500
            '#8b5cf6', // violet-500
            '#6366f1', // indigo-500
            '#06b6d4', // cyan-500
            '#f97316', // orange-500
            '#84cc16', // lime-500
            '#ec4899', // pink-500
        ];

        $cities = ['Paris', 'Milan', 'Tokyo', 'London', 'Berlin', 'Madrid', 'Rome', 'Sydney'];
        $children = ['Marcel', 'Sheila', 'Bobi', 'Tasha', 'Kiki', 'Lulu'];
        $privates = ['Joko', 'Budi', 'Santi', 'Eko', 'Rina'];

        foreach ($packages as $package) {
            $type = $package->type; // 'group', 'private', 'semi-private'
            $levelName = $package->level->name;
            
            // Assign to each branch to have variety in scheduling
            foreach ($branches as $branch) {
                if ($type === 'group' || $type === 'semi-private') {
                    if (str_contains(strtolower($levelName), 'kids')) {
                        // Kids group
                        foreach (array_slice($children, 0, 1) as $child) {
                            StudyClass::create([
                                'branch_id' => $branch->id,
                                'name' => "$child & Co (" . $branch->name . ")",
                                'class_color' => $vibrantColors[array_rand($vibrantColors)],
                                'package_id' => $package->id,
                            ]);
                        }
                    } else {
                        // Teen/Adult group
                        foreach (array_slice($cities, 0, 1) as $city) {
                            StudyClass::create([
                                'branch_id' => $branch->id,
                                'name' => "$city & Co (" . $branch->name . ")",
                                'class_color' => $vibrantColors[array_rand($vibrantColors)],
                                'package_id' => $package->id,
                            ]);
                        }
                    }
                } else if ($type === 'private') {
                    // Private
                    $shortLevel = str_contains($levelName, 'IELTS') ? 'IELTS' : 
                                 (str_contains($levelName, 'TOEFL') ? 'TOEFL' : $levelName);
                    
                    foreach (array_slice($privates, 0, 1) as $person) {
                        StudyClass::create([
                            'branch_id' => $branch->id,
                            'name' => "$person $shortLevel (" . $branch->name . ")",
                            'class_color' => $vibrantColors[array_rand($vibrantColors)],
                            'package_id' => $package->id,
                        ]);
                    }
                }
            }
        }
    }

}
