<?php

namespace App\Http\Requests\PtExam\PtQuestion;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePtQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pt_exam_id' => ['required', 'exists:pt_exams,id'],
            'question_text' => ['required', 'string'],
            'audio_path' => ['nullable', 'string', 'max:255'],
            'points' => ['required', 'integer', 'min:1'],
        ];
    }
}
