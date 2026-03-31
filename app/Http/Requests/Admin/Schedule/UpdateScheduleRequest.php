<?php

namespace App\Http\Requests\Admin\Schedule;

use Illuminate\Foundation\Http\FormRequest;

class UpdateScheduleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->hasRole('superadmin') || $this->user()->hasRole('frontdesk');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id' => 'required',
            'type' => 'required|in:schedule,session',
            'study_class_id' => 'required|exists:study_classes,id',
            'teacher_id' => 'required|exists:teachers,id',
            'room_id' => 'required|exists:rooms,id',
            'start_time' => 'required',
            'is_recurring' => 'required|boolean',
            'day_of_week' => 'required|integer|min:1|max:7',
            'date' => 'required|date',
            'branch_id' => 'required|exists:branches,id'
        ];
    }
}
