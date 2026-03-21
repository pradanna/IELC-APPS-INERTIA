<?php

namespace App\Http\Requests\Crm\Lead;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'dob' => ['nullable', 'date'],
            'address' => ['nullable', 'string'],
            'parent_name' => ['nullable', 'string', 'max:255'],
            'parent_phone' => ['nullable', 'string', 'max:255'],
            'branch_id' => ['required', 'exists:branches,id'],
            'lead_source_id' => ['nullable', 'exists:lead_sources,id'],
            'interest_level_id' => ['nullable', 'exists:levels,id'],
            'interest_package_id' => ['nullable', 'exists:packages,id'],
            'notes' => ['nullable', 'string'],
            'temperature' => ['nullable', 'string', 'in:cold,warm,hot'],
        ];
    }
}
