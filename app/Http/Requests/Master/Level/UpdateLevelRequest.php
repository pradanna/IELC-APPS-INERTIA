<?php

namespace App\Http\Requests\Master\Level;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLevelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'superadmin';
    }

    public function rules(): array
    {
        return [
            // Mengabaikan pengecekan unique untuk nama level yang sedang diedit
            'name'        => ['required', 'string', 'max:255', Rule::unique('levels', 'name')->ignore($this->level)],
            'description' => ['nullable', 'string'],
        ];
    }
}
