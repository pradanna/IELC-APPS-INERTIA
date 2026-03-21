<?php

namespace App\Http\Requests\Crm\Lead;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Support\Facades\Log;

class UpdateLeadStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // For now, we'll allow anyone who is logged in.
        // In a real app, you'd check for roles/permissions.
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'lead_status_id' => [
                'required',
                'integer',
                'exists:lead_statuses,id',
            ],
        ];
    }

    /**
     * Menangkap error validasi sebelum dikembalikan ke Frontend.
     */
    protected function failedValidation(Validator $validator)
    {
        Log::error('Validasi Ganti Status Gagal!', [
            'payload_yang_dikirim' => $this->all(),
            'pesan_error' => $validator->errors()->toArray()
        ]);
        parent::failedValidation($validator);
    }
}
