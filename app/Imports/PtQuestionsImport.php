<?php

namespace App\Imports;

use App\Models\PtExam;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class PtQuestionsImport implements ToCollection, WithHeadingRow
{
    protected $ptExam;
    protected $createdGroups = [];

    public function __construct(PtExam $ptExam)
    {
        $this->ptExam = $ptExam;
    }

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            // Abaikan jika baris tidak memiliki pertanyaan
            if (empty($row['pertanyaan'])) {
                continue;
            }

            $groupId = null;
            $kodeGrup = $row['kode_grup'] ?? null;

            if (!empty($kodeGrup)) {
                if (!isset($this->createdGroups[$kodeGrup])) {
                    // Buat grup baru untuk kode ini (Hanya dilakukan satu kali per kode grup)
                    $wacana = $row['instruksi_grup_wacana'] ?? '';
                    $instruction = !empty($wacana) ? mb_substr($wacana, 0, 250) : 'Instruksi untuk Grup ' . $kodeGrup;

                    $group = $this->ptExam->ptQuestionGroups()->create([
                        'instruction' => $instruction,
                        'reading_text' => $wacana ?: null,
                    ]);
                    $this->createdGroups[$kodeGrup] = $group->id;
                }
                $groupId = $this->createdGroups[$kodeGrup];
            }

            $question = $this->ptExam->questions()->create([
                'pt_question_group_id' => $groupId,
                'question_text' => $row['pertanyaan'],
                'points' => isset($row['bobot']) ? (int) $row['bobot'] : 1,
            ]);

            $options = [
                $row['pilihan_a'] ?? '',
                $row['pilihan_b'] ?? '',
                $row['pilihan_c'] ?? '',
                $row['pilihan_d'] ?? '',
            ];

            $kunci = trim((string)($row['kunci'] ?? '0'));
            if (is_numeric($kunci)) {
                $correctAnswerIndex = (int) $kunci;
            } else {
                $kunciUpper = strtoupper($kunci);
                $map = ['A' => 0, 'B' => 1, 'C' => 2, 'D' => 3];
                $correctAnswerIndex = $map[$kunciUpper] ?? 0;
            }

            foreach ($options as $index => $optionText) {
                $question->options()->create([
                    'option_text' => $optionText,
                    'is_correct' => $index === $correctAnswerIndex,
                ]);
            }
        }
    }
}
