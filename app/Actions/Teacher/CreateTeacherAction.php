<?php

namespace App\Actions\Teacher;

use App\Models\User;
use App\Models\Teacher;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CreateTeacherAction
{
    /**
     * Execute the action to create a new teacher.
     */
    public function execute(array $data): Teacher
    {
        return DB::transaction(function () use ($data) {
            // Create user account
            $user = User::create([
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => 'teacher',
                'uuid' => (string) Str::uuid(),
            ]);

            // Handle profile picture
            $profilePicturePath = null;
            if (!empty($data['profile_picture'])) {
                $profilePicturePath = $this->saveBase64Image($data['profile_picture'], 'teachers');
            }

            // Create teacher profile
            /** @var Teacher $teacher */
            $teacher = $user->teacherProfile()->create([
                'name' => $data['name'],
                'phone' => $data['phone'],
                'address' => $data['address'],
                'bio' => $data['bio'],
                'specialization' => $data['specialization'],
                'profile_picture' => $profilePicturePath,
            ]);

            // Assign branch
            $teacher->branches()->attach($data['branch_id'], ['is_primary' => true]);

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
