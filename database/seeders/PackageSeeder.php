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
        $levels = Level::all()->keyBy('name');

        if ($levels->isEmpty()) {
            $this->command->warn('No levels found. Skipping PackageSeeder.');
            return;
        }

        $packages = [
            // Kids 1 Packages
            [
                'level_name' => 'Kids 1',
                'name' => 'Group Kids 1 Offline',
                'description' => 'Kelas tatap muka reguler untuk level Kids 1. Kuota terbatas 8-10 siswa per kelas untuk menjamin interaksi optimal.',
                'type' => 'group',
                'sessions_count' => 12,
                'price' => 1100000,
                'is_active' => true,
            ],
            [
                'level_name' => 'Kids 1',
                'name' => 'Group Kids 1 Online',
                'description' => 'Kelas interaktif via Zoom. Dilengkapi dengan modul digital yang atraktif untuk anak-anak.',
                'type' => 'group',
                'sessions_count' => 12,
                'price' => 1100000,
                'is_active' => true,
            ],
            [
                'level_name' => 'Kids 1',
                'name' => 'Private Kids 1',
                'description' => 'Kelas 1-on-1 eksklusif (Offline/Online). Bebas pilih jadwal. Guru fokus penuh mendampingi siswa.',
                'type' => 'private',
                'sessions_count' => 12,
                'price' => 2500000,
                'is_active' => true,
            ],

            // Kids 2 Packages
            [
                'level_name' => 'Kids 2',
                'name' => 'Group Kids 2 Offline',
                'description' => 'Lanjutan dari kelas Kids 1. Fokus meningkatkan kosakata kosa kata lanjutan dan kelancaran berbicara.',
                'type' => 'group',
                'sessions_count' => 12,
                'price' => 1100000,
                'is_active' => true,
            ],
            [
                'level_name' => 'Kids 2',
                'name' => 'Group Kids 2 Online',
                'description' => 'Kelas daring rutin Kids 2 dengan native speaker support pada sesi tertentu.',
                'type' => 'group',
                'sessions_count' => 12,
                'price' => 1100000,
                'is_active' => true,
            ],
            [
                'level_name' => 'Kids 2',
                'name' => 'Semi-Private Kids 2',
                'description' => 'Belajar berkelompok kecil (2-3 siswa saja). Cocok bagi kakak-adik atau sahabat. Harga lebih hemat dibanding Full Privat.',
                'type' => 'semi-private',
                'sessions_count' => 12,
                'price' => 1800000,
                'is_active' => true,
            ],

            // Teens 1 Packages
            [
                'level_name' => 'Teens 1',
                'name' => 'Group Teens 1 Offline',
                'description' => 'Bahasa Inggris untuk remaja. Topik disesuaikan dengan kurikulum pergaulan dan sekolah internasional.',
                'type' => 'group',
                'sessions_count' => 16,
                'price' => 1450000,
                'is_active' => true,
            ],
            [
                'level_name' => 'Teens 1',
                'name' => 'Intensive Private Teens 1',
                'description' => 'Program percepatan untuk remaja bersertifikat internasional. Durasi bisa lebih panjang setiap pertemuannya.',
                'type' => 'private',
                'sessions_count' => 16,
                'price' => 3100000,
                'is_active' => true,
            ],

            // TOEFL Packages
            [
                'level_name' => 'TOEFL Preparation',
                'name' => 'TOEFL PBT/ITP Group Batch',
                'description' => 'Kelas persiapan TOEFL intensif dengan 4x simulasi tryout gratis.',
                'type' => 'group',
                'sessions_count' => 24,
                'price' => 2500000,
                'is_active' => true,
            ],
            [
                'level_name' => 'TOEFL Preparation',
                'name' => 'TOEFL Score Booster (Private)',
                'description' => 'Kelas GARANSI NAIK SKOR. Bila skor mock test tidak tembus target 550, konsultasi free seumur hidup.',
                'type' => 'private',
                'sessions_count' => 24,
                'price' => 4500000,
                'is_active' => true,
            ],

            // IELTS Packages
            [
                'level_name' => 'IELTS Preparation',
                'name' => 'IELTS Premium Group',
                'description' => 'Evaluasi writing task satu persatu bersama expert instuktur. Fokus pada band 6.5 ke atas.',
                'type' => 'group',
                'sessions_count' => 24,
                'price' => 3200000,
                'is_active' => true,
            ],
            [
                'level_name' => 'IELTS Preparation',
                'name' => 'IELTS Executive Semi-Private',
                'description' => 'Satu kelas 2 siswa khusus eksekutif / pro yang sedang mengejar visa beasiswa atau working holiday.',
                'type' => 'semi-private',
                'sessions_count' => 24,
                'price' => 5000000,
                'is_active' => true,
            ]
        ];

        foreach ($packages as $pkg) {
            if ($levels->has($pkg['level_name'])) {
                Package::create([
                    'level_id' => $levels[$pkg['level_name']]->id,
                    'name' => $pkg['name'],
                    'description' => $pkg['description'],
                    'type' => $pkg['type'],
                    'sessions_count' => $pkg['sessions_count'],
                    'duration_days' => $pkg['duration_days'] ?? 84, // Use 84 as default (12 weeks)
                    'price' => $pkg['price'],
                    'is_active' => $pkg['is_active'],
                ]);
            }
        }
    }
}
