<?php

namespace App\Http\Requests\Master\Level;

use Illuminate\Foundation\Http\FormRequest;

class StoreLevelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'superadmin';
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255', 'unique:levels,name'],
            'description' => ['nullable', 'string'],
        ];
    }
}
