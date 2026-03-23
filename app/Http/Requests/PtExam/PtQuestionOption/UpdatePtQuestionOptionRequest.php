<?php

namespace App\Http\Requests\PtExam\PtQuestionOption;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePtQuestionOptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pt_question_id' => ['required', 'exists:pt_questions,id'],
            'option_text' => ['required', 'string', 'max:255'],
            'is_correct' => ['boolean'],
        ];
    }
}
