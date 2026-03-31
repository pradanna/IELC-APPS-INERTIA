<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentScoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'study_class_id' => 'required|exists:study_classes,id',
            'assessment_type' => 'required|string|max:255',
            'reading' => 'required|numeric|min:0|max:100',
            'listening' => 'required|numeric|min:0|max:100',
            'speaking' => 'required|numeric|min:0|max:100',
            'final_feedback' => 'nullable|string',
        ];
    }
}
