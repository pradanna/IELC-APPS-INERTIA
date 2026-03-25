<?php

namespace App\Imports;

use App\Models\PtExam;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class PtQuestionsImport implements ToCollection, WithHeadingRow
{
    protected $ptExam;

    public function __construct(PtExam $ptExam)
    {
        $this->ptExam = $ptExam;
    }

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            // Abaikan jika baris tidak memiliki pertanyaan
            if (empty($row['question_text'])) {
                continue;
            }

            $question = $this->ptExam->questions()->create([
                'question_text' => $row['question_text'],
                'points' => isset($row['points']) ? (int) $row['points'] : 1,
            ]);

            $options = [
                $row['option_a'] ?? '',
                $row['option_b'] ?? '',
                $row['option_c'] ?? '',
                $row['option_d'] ?? '',
            ];

            $correctAnswerIndex = isset($row['correct_answer_index']) ? (int) $row['correct_answer_index'] : 0;

            foreach ($options as $index => $optionText) {
                $question->options()->create([
                    'option_text' => $optionText,
                    'is_correct' => $index === $correctAnswerIndex,
                ]);
            }
        }
    }
}
