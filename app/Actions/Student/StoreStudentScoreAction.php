<?php

namespace App\Actions\Student;

use App\Models\Student;
use App\Models\StudentScore;
use Illuminate\Support\Facades\DB;

class StoreStudentScoreAction
{
    /**
     * Store the student score and calculate total score based on reading, listening, and speaking.
     */
    public function execute(Student $student, array $data): StudentScore
    {
        try {
            return DB::transaction(function () use ($student, $data) {
                // Calculate total_score
                $totalScore = ($data['reading'] + $data['listening'] + $data['speaking']) / 3;

                // Create Student Score Record
                return StudentScore::create([
                    'study_class_id' => $data['study_class_id'],
                    'student_id'     => $student->id,
                    'assessment_type' => $data['assessment_type'],
                    'score_details'  => [
                        'reading'   => $data['reading'],
                        'listening' => $data['listening'],
                        'speaking'  => $data['speaking'],
                    ],
                    'total_score'    => round($totalScore, 2),
                    'final_feedback' => $data['final_feedback'] ?? null,
                ]);
            });
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Gagal menyimpan skor siswa (ID: {$student->id}): " . $e->getMessage());
            throw $e;
        }
    }
}
