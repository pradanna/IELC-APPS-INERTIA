<?php

namespace App\Actions\Admin\Schedule;

use App\Models\ClassSchedule;
use App\Models\ClassSession;

class DeleteScheduleAction
{
    /**
     * Execute the action.
     */
    public function execute(array $data): void
    {
        $id = $data['id'];
        $type = $data['type'];
        
        if ($type === 'session') {
            ClassSession::where('id', $id)->delete();
        } else if ($type === 'schedule') {
            ClassSchedule::where('id', $id)->delete();
            
            // Optional: If we delete the template for today, should we delete the session too?
            // Usually yes, if it's the exact instance of that template.
            if ($data['date'] ?? null) {
                // ... logic to delete current session if needed
            }
        }
    }
}
