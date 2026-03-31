<?php

namespace App\Http\Requests\PtExam\PtAnswer;

use Illuminate\Foundation\Http\FormRequest;

class StorePtAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pt_session_id' => ['required', 'exists:pt_sessions,id'],
            'pt_question_id' => ['required', 'exists:pt_questions,id'],
            'pt_question_option_id' => ['nullable', 'exists:pt_question_options,id'],
            'is_correct' => ['boolean'],
        ];
    }
}
