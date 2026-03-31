<?php

namespace App\Http\Requests\Master\Package;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'superadmin';
    }

    public function rules(): array
    {
        return [
            'name'           => ['required', 'string', 'max:255'],
            'description'    => ['nullable', 'string'],
            'level_id'       => ['required', 'exists:levels,id'],
            'type'           => ['required', Rule::in(['group', 'private', 'semi-private'])],
            'sessions_count' => ['required', 'integer', 'min:1'],
            'duration_days'  => ['required', 'integer', 'min:1'],
            'price'          => ['required', 'numeric', 'min:0'],
            'is_active'      => ['boolean'],
        ];
    }
}
