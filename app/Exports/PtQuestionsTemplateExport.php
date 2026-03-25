<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class PtQuestionsTemplateExport implements FromArray, WithHeadings, ShouldAutoSize
{
    public function headings(): array
    {
        return [
            'kode_grup',
            'instruksi_grup_wacana',
            'pertanyaan',
            'pilihan_a',
            'pilihan_b',
            'pilihan_c',
            'pilihan_d',
            'kunci',
            'bobot'
        ];
    }

    public function array(): array
    {
        return [
            [
                'G1', // kode_grup
                'Read the text carefully: This is a short story...', // instruksi_grup_wacana
                'What is the main idea of the story?', // pertanyaan
                'Main Idea A', // pilihan_a
                'Main Idea B', // pilihan_b
                'Main Idea C', // pilihan_c
                'Main Idea D', // pilihan_d
                'A', // kunci
                '2' // bobot
            ],
            [
                'G1', // kode_grup (menggunakan grup yang sama)
                '', // instruksi_grup_wacana (kosongkan jika sudah didefinisikan di baris sebelumnya)
                'What does the word "it" refer to?', // pertanyaan
                'Option A', // pilihan_a
                'Option B', // pilihan_b
                'Option C', // pilihan_c
                'Option D', // pilihan_d
                'B', // kunci
                '2' // bobot
            ],
            [
                '', // kode_grup (kosongkan untuk pertanyaan tanpa grup)
                '', // instruksi_grup_wacana
                'What is the capital city of Indonesia?', // pertanyaan
                'Jakarta',
                'Bandung',
                'Surabaya',
                'Medan',
                'A', // kunci (bisa huruf A/B/C/D atau angka 0/1/2/3)
                '1' // bobot
            ]
        ];
    }
}
