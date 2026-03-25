<?php

namespace App\Actions\PtExam\PtQuestion;

use App\Models\PtQuestion;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class UpdatePtQuestionAction
{
    public function execute(PtQuestion $ptQuestion, array $data, ?UploadedFile $mediaFile = null): PtQuestion
    {
        if ($mediaFile) {
            $filename = Str::random(40) . '.' . $mediaFile->getClientOriginalExtension();
            $mediaFile->move(public_path('uploads/pt-questions-media'), $filename);
            $data['audio_path'] = 'uploads/pt-questions-media/' . $filename;
        }

        $ptQuestion->update([
            'pt_question_group_id' => $data['pt_question_group_id'] ?? $ptQuestion->pt_question_group_id,
            'question_text' => $data['question_text'],
            'points' => $data['points'],
            'audio_path' => $data['audio_path'] ?? $ptQuestion->audio_path,
        ]);

        // Ambil opsi yang sudah ada agar tidak merusak relasi dengan jawaban di database
        $existingOptions = $ptQuestion->options()->orderBy('id')->get();

        foreach ($data['options'] as $index => $optionText) {
            $isCorrect = ((int)$index === (int)$data['correct_answer']);

            if ($existingOptions->has($index)) {
                $existingOptions[$index]->update([
                    'option_text' => $optionText,
                    'is_correct' => $isCorrect,
                ]);
            } else {
                $ptQuestion->options()->create([
                    'option_text' => $optionText,
                    'is_correct' => $isCorrect,
                ]);
            }
        }

        return $ptQuestion;
    }
}
