<?php

namespace App\Actions\Teacher;

use App\Models\Teacher;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UpdateTeacherAction
{
    /**
     * Execute the action to update a teacher profile.
     */
    public function execute(Teacher $teacher, array $data): Teacher
    {
        return DB::transaction(function () use ($teacher, $data) {
            // Update user record
            $teacher->user->update([
                'email' => $data['email'],
            ]);

            // Handle profile picture update
            if (!empty($data['profile_picture']) && !str_starts_with($data['profile_picture'], 'http')) {
                if ($teacher->profile_picture) {
                    Storage::disk('uploads')->delete($teacher->profile_picture);
                }
                $profilePicturePath = $this->saveBase64Image($data['profile_picture'], 'teachers');
                $teacher->update(['profile_picture' => $profilePicturePath]);
            }

            // Update teacher record
            $teacher->update([
                'name' => $data['name'],
                'phone' => $data['phone'],
                'address' => $data['address'],
                'bio' => $data['bio'],
                'specialization' => $data['specialization'],
            ]);

            // Sync branches (primary)
            $teacher->branches()->sync([$data['branch_id'] => ['is_primary' => true]]);

            return $teacher;
        });
    }

    private function saveBase64Image($base64String, $folder): string
    {
        if (preg_match('/^data:image\/(\w+);base64,/', $base64String, $type)) {
            $data = substr($base64String, strpos($base64String, ',') + 1);
            $type = strtolower($type[1]);

            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new \Exception('invalid image type');
            }
            $decryptedData = base64_decode($data);

            if ($decryptedData === false) {
                throw new \Exception('base64_decode failed');
            }
        } else {
            throw new \Exception('did not match data URI with image data');
        }

        $fileName = (string) Str::uuid() . '.' . $type;
        Storage::disk('uploads')->put($folder . '/' . $fileName, $decryptedData);

        return $folder . '/' . $fileName;
    }
}
