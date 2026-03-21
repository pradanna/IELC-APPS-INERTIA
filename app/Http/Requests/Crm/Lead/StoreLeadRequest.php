<?php

namespace App\Http\Requests\Crm\Lead;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeadRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20', 'regex:/^\+?[0-9\s\-]{8,20}$/'],
            'email' => ['nullable', 'email', 'max:255'],
            'dob' => ['nullable', 'date'],
            'address' => ['nullable', 'string'],
            'parent_name' => ['nullable', 'string', 'max:255'],
            'parent_phone' => ['nullable', 'string', 'max:20', 'regex:/^\+?[0-9\s\-]{8,20}$/'],
            'branch_id' => ['required', 'exists:branches,id'],
            'lead_source_id' => ['nullable', 'exists:lead_sources,id'],
            'interest_level_id' => ['nullable', 'exists:levels,id'],
            'interest_package_id' => ['nullable', 'exists:packages,id'],
            'notes' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'phone.regex' => 'Format nomor telepon tidak valid. Hanya boleh berisi angka, spasi, tanda hubung (-), dan boleh diawali dengan (+).',
            'parent_phone.regex' => 'Format nomor telepon orang tua tidak valid. Hanya boleh berisi angka, spasi, tanda hubung (-), dan boleh diawali dengan (+).',
        ];
    }
}
