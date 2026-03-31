<?php

namespace App\Actions\Admin\Academic;

use App\Models\StudentScore;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MassStoreScoreAction
{
    /**
     * Execute the mass score storage.
     * 
     * @param int $studyClassId
     * @param string $assessmentType
     * @param array $scoresArray  Format: [['student_id' => X, 'total_score' => Y, 'final_feedback' => Z, ...], ...]
     * @return void
     */
    public function execute(int $studyClassId, string $assessmentType, int $sessionNumber, array $scoresArray): void
    {
        DB::transaction(function () use ($studyClassId, $assessmentType, $sessionNumber, $scoresArray) {
            foreach ($scoresArray as $scoreData) {
                // Calculate average if sub-scores are provided
                $details = $scoreData['score_details'] ?? [];
                
                $listening = floatval($details['listening'] ?? 0);
                $reading   = floatval($details['reading'] ?? 0);
                $speaking  = floatval($details['speaking'] ?? 0);
                
                $totalScore = ($listening + $reading + $speaking) / 3;
                
                if ($listening == 0 && $reading == 0 && $speaking == 0 && isset($scoreData['total_score'])) {
                    $totalScore = $scoreData['total_score'];
                }

                $score = StudentScore::updateOrCreate(
                    [
                        'study_class_id' => $studyClassId,
                        'student_id'     => $scoreData['student_id'],
                        'assessment_type' => $assessmentType,
                        'session_number' => $sessionNumber,
                    ],
                    [
                        'total_score'    => $totalScore,
                        'final_feedback' => $scoreData['final_feedback'] ?? null,
                        'score_details'  => [
                            'listening' => $listening,
                            'reading'   => $reading,
                            'speaking'  => $speaking,
                        ],
                    ]
                );
            }
        });
    }
}
