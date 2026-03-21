<?php

namespace App\Http\Requests\Crm\Lead;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeadFollowupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Asumsi middleware auth & role sudah menangani ini di routes
    }

    public function rules(): array
    {
        return [
            // Menyesuaikan Enum 'method' pada tabel lead_followups
            'method' => ['required', 'string', 'in:whatsapp,call,email,meeting'],
            'scheduled_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'lead_status_id' => ['required', 'exists:lead_statuses,id'],
        ];
    }
}
