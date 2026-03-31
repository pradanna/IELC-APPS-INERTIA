<?php

namespace App\Http\Requests\PtExam\PtSession;

use Illuminate\Foundation\Http\FormRequest;

class StorePtSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'lead_id' => ['required', 'exists:leads,id'],
            'pt_exam_id' => ['required', 'exists:pt_exams,id'],
        ];
    }
}
