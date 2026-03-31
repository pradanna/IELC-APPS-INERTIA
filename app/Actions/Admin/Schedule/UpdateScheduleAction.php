<?php

namespace App\Actions\Admin\Schedule;

use App\Models\ClassSchedule;
use App\Models\ClassSession;
use Carbon\Carbon;

class UpdateScheduleAction
{
    /**
     * Execute the action.
     */
    public function execute(array $data): void
    {
        $id = $data['id'];
        $type = $data['type'];
        $isRecurring = filter_var($data['is_recurring'], FILTER_VALIDATE_BOOLEAN);
        
        $startTime = Carbon::parse($data['start_time'])->format('H:i');
        $endTime = Carbon::parse($data['start_time'])->addHour()->format('H:i');

        // Inherit branch_id from study class
        $studyClass = \App\Models\StudyClass::findOrFail($data['study_class_id']);
        $data['branch_id'] = $studyClass->branch_id;

        // Case 1: Updating a template-based schedule (Recurring)
        if ($type === 'schedule') {
            $schedule = ClassSchedule::find($id);
            if ($schedule) {
                if (!$isRecurring) {
                    // Switch to one-off: Delete the template, create a session instance
                    $schedule->delete();
                    ClassSession::create([
                        'branch_id' => $data['branch_id'],
                        'date' => $data['date'],
                        'room_id' => $data['room_id'],
                        'start_time' => $startTime,
                        'end_time' => $endTime,
                        'study_class_id' => $data['study_class_id'],
                        'teacher_id' => $data['teacher_id'],
                        'status' => 'scheduled',
                    ]);
                } else {
                    // Stay recurring: Update the template ONLY
                    $schedule->update([
                        'room_id' => $data['room_id'],
                        'start_time' => $startTime,
                        'end_time' => $endTime,
                        'day_of_week' => $data['day_of_week'],
                        'study_class_id' => $data['study_class_id'],
                        'teacher_id' => $data['teacher_id'],
                    ]);
                }
            }
        } 
        
        // Case 2: Updating a specific session instance (One-off)
        else if ($type === 'session') {
            $session = ClassSession::find($id);
            if ($session) {
                if ($isRecurring) {
                    // Switch to recurring: Delete session, create template
                    $session->delete();
                    ClassSchedule::create([
                        'branch_id' => $data['branch_id'],
                        'room_id' => $data['room_id'],
                        'day_of_week' => $data['day_of_week'],
                        'start_time' => $startTime,
                        'end_time' => $endTime,
                        'study_class_id' => $data['study_class_id'],
                        'teacher_id' => $data['teacher_id'],
                    ]);
                } else {
                    // Stay one-off: Update specific session ONLY
                    $session->update([
                        'room_id' => $data['room_id'],
                        'start_time' => $startTime,
                        'end_time' => $endTime,
                        'date' => $data['date'],
                        'study_class_id' => $data['study_class_id'],
                        'teacher_id' => $data['teacher_id'],
                    ]);
                }
            }
        }
    }

}
