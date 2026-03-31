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
            'question_text',
            'points',
            'option_a',
            'option_b',
            'option_c',
            'option_d',
            'correct_answer_index'
        ];
    }

    public function array(): array
    {
        return [
            [
                'What is the capital of Indonesia?',
                '1',
                'Jakarta',
                'Bandung',
                'Surabaya',
                'Medan',
                '0' // 0 berarti A
            ]
        ];
    }
}
