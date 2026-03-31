<?php

namespace App\Http\Requests\Master\MonthlyTarget;

use Illuminate\Foundation\Http\FormRequest;

class SaveMonthlyTargetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'branch_id' => ['required', 'exists:branches,id'],
            'month' => ['required', 'integer', 'min:1', 'max:12'],
            'year' => ['required', 'integer', 'min:2020', 'max:2099'],
            'target_enrolled' => ['required', 'integer', 'min:1'],
        ];
    }
}
