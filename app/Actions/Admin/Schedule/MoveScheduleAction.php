<?php

namespace App\Actions\Admin\Schedule;

use App\Models\ClassSchedule;
use App\Models\ClassSession;
use Carbon\Carbon;

class MoveScheduleAction
{
    /**
     * Execute the action.
     */
    public function execute(array $data): void
    {
        $id = $data['id'];
        $type = $data['type'];
        $newRoomId = $data['new_room_id'];
        $newStartTimeStr = $data['new_start_time']; // E.g., "09:00"
        $date = $data['date'];
        
        $newStartTime = Carbon::parse($newStartTimeStr);
        $newEndTime = (clone $newStartTime)->addHour(); // Keep 1 hour duration

        if ($type === 'session') {
            // 1. Move a specific session instance ONLY
            ClassSession::where('id', $id)->update([
                'room_id' => $newRoomId,
                'start_time' => $newStartTime->format('H:i'),
                'end_time' => $newEndTime->format('H:i'),
            ]);
        } else {
            // 2. Move a recurring template ONLY
            ClassSchedule::where('id', $id)->update([
                'room_id' => $newRoomId,
                'start_time' => $newStartTime->format('H:i'),
                'end_time' => $newEndTime->format('H:i'),
            ]);
        }
    }
}
