<?php

namespace App\Actions\PtExam;

use App\Models\PtSession;
use App\Models\PtAnswer;
use Illuminate\Support\Facades\DB;

class SubmitPlacementTestAction
{
    public function execute(PtSession $session, array $submittedAnswers): void
    {
        $totalScore = 0;
        $answersData = [];

        // Kumpulkan semua soal (mandiri & grup) beserta opsinya untuk dicocokkan
        $allQuestions = collect();
        foreach ($session->ptExam->questions as $q) {
            $allQuestions->push($q);
        }
        foreach ($session->ptExam->ptQuestionGroups as $group) {
            foreach ($group->questions as $q) {
                $allQuestions->push($q);
            }
        }

        $questionMap = $allQuestions->keyBy('id');

        foreach ($submittedAnswers as $questionId => $optionId) {
            $question = $questionMap->get($questionId);
            if (!$question) continue;

            $selectedOption = $question->options->firstWhere('id', $optionId);
            $isCorrect = $selectedOption && $selectedOption->is_correct;

            if ($isCorrect) {
                $totalScore += $question->points;
            }

            $answersData[] = [
                'pt_session_id' => $session->id,
                'pt_question_id' => $questionId,
                'pt_question_option_id' => $optionId,
                'is_correct' => $isCorrect,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::transaction(function () use ($session, $answersData, $totalScore) {
            if (!empty($answersData)) {
                PtAnswer::insert($answersData);
            }

            $session->update([
                'status' => 'completed',
                'finished_at' => now(),
                'final_score' => $totalScore,
            ]);
        });
    }
}
