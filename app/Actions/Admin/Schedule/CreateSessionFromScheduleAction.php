<?php

namespace App\Actions\Admin\Schedule;

use App\Models\ClassSchedule;
use App\Models\ClassSession;
use Carbon\Carbon;

class CreateSessionFromScheduleAction
{
    /**
     * Transform a ClassSchedule template into a real ClassSession instance for a specific date.
     */
    public function execute(ClassSchedule $schedule, string $date): ClassSession
    {
        return ClassSession::updateOrCreate(
            [
                'branch_id' => $schedule->branch_id,
                'room_id' => $schedule->room_id,
                'date' => $date,
                'start_time' => $schedule->start_time,
            ],
            [
                'study_class_id' => $schedule->study_class_id,
                'teacher_id' => $schedule->teacher_id,
                'end_time' => $schedule->end_time,
                'status' => 'scheduled',
            ]
        );
    }
}
