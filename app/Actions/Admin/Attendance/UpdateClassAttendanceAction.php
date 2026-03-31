<?php

namespace App\Actions\Admin\Attendance;

use App\Models\ClassSession;
use App\Models\Attendance;
use Illuminate\Support\Facades\DB;

class UpdateClassAttendanceAction
{
    /**
     * Execute the attendance update logic.
     * 
     * @param ClassSession $classSession
     * @param array $data
     */
    public function execute(ClassSession $classSession, array $data): void
    {
        DB::transaction(function () use ($classSession, $data) {
            // 1. Update Class Session details
            $classSession->update([
                'topic_taught' => $data['topic_taught'],
                'status' => 'completed',
            ]);

            // 2. Update Student Attendances
            foreach ($data['attendances'] as $attendanceData) {
                Attendance::updateOrCreate(
                    [
                        'class_session_id' => $classSession->id,
                        'student_id' => $attendanceData['student_id'],
                    ],
                    [
                        'status' => $attendanceData['status'],
                        'late_minutes' => $attendanceData['status'] === 'late' ? ($attendanceData['late_minutes'] ?? 0) : null,
                        'teacher_notes' => $attendanceData['teacher_notes'] ?? null,
                    ]
                );
            }
        });
    }
}
