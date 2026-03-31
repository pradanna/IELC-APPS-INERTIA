<?php

namespace App\Http\Requests\Master\LeadSource;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeadSourceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'superadmin';
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:lead_sources,name'],
        ];
    }
}
