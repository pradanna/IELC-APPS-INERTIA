<?php

namespace App\Actions\Teacher;

use App\Models\Teacher;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DeleteTeacherAction
{
    /**
     * Execute the action to delete a teacher.
     */
    public function execute(Teacher $teacher): void
    {
        DB::transaction(function () use ($teacher) {
            // Delete profile picture
            if ($teacher->profile_picture) {
                Storage::disk('uploads')->delete($teacher->profile_picture);
            }

            $user = $teacher->user;

            // Delete teacher and user records
            $teacher->delete();
            $user->delete();
        });
    }
}
