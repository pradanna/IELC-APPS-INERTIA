<?php

namespace App\Actions\Admin\Schedule;

use App\Models\ClassSchedule;
use App\Models\ClassSession;
use Carbon\Carbon;

class StoreScheduleAction
{
    /**
     * Execute the action.
     */
    public function execute(array $data): void
    {
        $startTime = Carbon::parse($data['start_time']);
        $endTime = (clone $startTime)->addHour(); // Default duration = 1 hour
        $isRecurring = filter_var($data['is_recurring'], FILTER_VALIDATE_BOOLEAN);

        // Inherit branch_id from study class
        $studyClass = \App\Models\StudyClass::findOrFail($data['study_class_id']);
        $data['branch_id'] = $studyClass->branch_id;

        // Strict Separation Logic
        if ($isRecurring) {
            // 1. Handle Recurring Template (Weekly Schedule) ONLY
            ClassSchedule::updateOrCreate(
                [
                    'branch_id' => $data['branch_id'],
                    'room_id' => $data['room_id'],
                    'day_of_week' => $data['day_of_week'],
                    'start_time' => $startTime->format('H:i'),
                ],
                [
                    'study_class_id' => $data['study_class_id'],
                    'teacher_id' => $data['teacher_id'],
                    'end_time' => $endTime->format('H:i'),
                ]
            );
        } else {
            // 2. Handle Specific Session Instance (Class Session) ONLY
            // We expect a date to be provided for one-off instances
            if ($data['date'] ?? null) {
                ClassSession::updateOrCreate(
                    [
                        'branch_id' => $data['branch_id'],
                        'room_id' => $data['room_id'],
                        'date' => $data['date'],
                        'start_time' => $startTime->format('H:i'),
                    ],
                    [
                        'study_class_id' => $data['study_class_id'],
                        'teacher_id' => $data['teacher_id'],
                        'end_time' => $endTime->format('H:i'),
                        'status' => 'scheduled',
                    ]
                );
            }
        }
    }
}
