<?php

namespace Database\Seeders;

use App\Models\StudyClass;
use App\Models\Package;
use Illuminate\Database\Seeder;

class StudyClassSeeder extends Seeder
{
    public function run(): void
    {
        $packages = Package::with('level')->get();

        // Soft, aesthetic color palette (Tailwind-like)
        $softColors = [
            '#ecfdf5', // emerald-50
            '#eff6ff', // blue-50
            '#fdf2f8', // pink-50
            '#faf5ff', // purple-50
            '#fffbeb', // amber-50
            '#f0fdf4', // green-50
            '#f5f3ff', // violet-50
            '#fff1f2', // rose-50
            '#f0f9ff', // sky-50
            '#fdf4ff', // fuchsia-50
        ];

        $cities = ['Paris', 'Milan', 'Tokyo', 'London', 'Berlin', 'Madrid', 'Rome', 'Sydney'];
        $children = ['Marcel', 'Sheila', 'Bobi', 'Tasha', 'Kiki', 'Lulu'];
        $privates = ['Joko', 'Budi', 'Santi', 'Eko', 'Rina'];

        foreach ($packages as $package) {
            $type = $package->type; // 'group', 'private', 'semi-private'
            $levelName = $package->level->name;

            if ($type === 'group' || $type === 'semi-private') {
                if (str_contains(strtolower($levelName), 'kids')) {
                    // Kids group
                    foreach (array_slice($children, 0, 2) as $child) {
                        StudyClass::create([
                            'name' => "$child & Co",
                            'class_color' => $softColors[array_rand($softColors)],
                            'package_id' => $package->id,
                        ]);
                    }
                } else {
                    // Teen/Adult group
                    foreach (array_slice($cities, 0, 2) as $city) {
                        StudyClass::create([
                            'name' => "$city & Co",
                            'class_color' => $softColors[array_rand($softColors)],
                            'package_id' => $package->id,
                        ]);
                    }
                }
            } else if ($type === 'private') {
                // Private
                $shortLevel = str_contains($levelName, 'IELTS') ? 'IELTS' : 
                             (str_contains($levelName, 'TOEFL') ? 'TOEFL' : $levelName);
                
                foreach (array_slice($privates, 0, 2) as $person) {
                    StudyClass::create([
                        'name' => "$person $shortLevel",
                        'class_color' => $softColors[array_rand($softColors)],
                        'package_id' => $package->id,
                    ]);
                }
            }
        }
    }
}
