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
            'pt_question_group_id' => ['nullable', 'exists:pt_question_groups,id'],
            'question_text' => ['required', 'string'],
            'points' => ['required', 'integer', 'min:1'],
            'options' => ['required', 'array', 'size:4'],
            'options.*' => ['required', 'string'],
            'correct_answer' => ['required', 'integer', 'min:0', 'max:3'],
            'media' => ['nullable', 'file', 'mimes:mp3,wav,mp4,mov,avi', 'max:20480'], // Max 20MB
        ];
    }
}
