<?php

namespace App\Http\Requests\Master\Branch;

use Illuminate\Foundation\Http\FormRequest;

class StoreBranchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'superadmin';
    }

    public function rules(): array
    {
        return [
            'name'    => ['required', 'string', 'max:255'],
            'phone'   => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
        ];
    }
}
