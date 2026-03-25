<?php

namespace App\Http\Requests\PtExam\PtQuestionGroup;

use Illuminate\Foundation\Http\FormRequest;

class StorePtQuestionGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Validasi Grup
            'instruction' => ['required', 'string', 'max:255'],
            'audio_path' => ['nullable', 'file', 'mimes:mp3,wav', 'max:20480'],
            'reading_text' => ['nullable', 'string'],
        ];
    }
}
