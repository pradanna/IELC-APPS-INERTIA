<?php

namespace App\Http\Requests\PtExam\PtSession;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePtSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:pending,in_progress,completed'],
            'started_at' => ['nullable', 'date'],
            'finished_at' => ['nullable', 'date', 'after_or_equal:started_at'],
            'final_score' => ['nullable', 'integer', 'min:0'],
            'recommended_level' => ['nullable', 'string', 'max:255'],
        ];
    }
}
