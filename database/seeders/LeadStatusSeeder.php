<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeadStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('lead_statuses')->insert([
            [
                'name' => 'New',
                'description' => 'Calon siswa baru, belum dihubungi.',
                'text_color' => '#FFFFFF',
                'bg_color' => '#007BFF',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Contacted',
                'description' => 'Sudah dihubungi (telepon/WA/email).',
                'text_color' => '#FFFFFF',
                'bg_color' => '#17A2B8',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Follow Up',
                'description' => 'Dalam proses follow up.',
                'text_color' => '#000000',
                'bg_color' => '#FFC107',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Placement Test',
                'description' => 'Dijadwalkan atau sudah mengikuti placement test.',
                'text_color' => '#FFFFFF',
                'bg_color' => '#6F42C1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Joined',
                'description' => 'Berhasil bergabung menjadi siswa.',
                'text_color' => '#FFFFFF',
                'bg_color' => '#28A745',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lost',
                'description' => 'Calon siswa tidak jadi bergabung.',
                'text_color' => '#FFFFFF',
                'bg_color' => '#DC3545',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
