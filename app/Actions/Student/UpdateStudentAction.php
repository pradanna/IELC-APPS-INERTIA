<?php

namespace App\Actions\Student;

use App\Models\Student;
use Illuminate\Support\Facades\DB;

class UpdateStudentAction
{
    /**
     * Update the student and its associated lead record.
     */
    public function execute(Student $student, array $data): Student
    {
        try {
            return DB::transaction(function () use ($student, $data) {
                $profilePicture = $student->profile_picture;
                if (isset($data['profile_picture']) && $data['profile_picture'] instanceof \Illuminate\Http\UploadedFile) {
                    $file = $data['profile_picture'];
                    $ext = $file->getClientOriginalExtension() ?: $file->guessExtension() ?: 'jpg';
                    $filename = 'student_' . $student->id . '_' . time() . '.' . $ext;
                    
                    $uploadPath = public_path('uploads/students');
                    if (!file_exists($uploadPath)) {
                        mkdir($uploadPath, 0755, true);
                    }

                    // Pindahkan ke folder public/uploads/students (Tanpa storage:link)
                    $file->move($uploadPath, $filename);
                    $profilePicture = '/uploads/students/' . $filename;
                }

                // Update Student Record (NIS, status, profile_picture)
                $student->update([
                    'nis'             => $data['nis'] ?? $student->nis,
                    'status'          => $data['status'] ?? $student->status,
                    'profile_picture' => $profilePicture,
                ]);

                // Update associated Lead Record (Personal Data)
                if ($student->lead) {
                    $student->lead->update([
                        'name'         => $data['name'] ?? $student->lead->name,
                        'email'        => $data['email'] ?? $student->lead->email,
                        'phone'        => $data['phone'] ?? $student->lead->phone,
                        'dob'          => $data['dob'] ?? $student->lead->dob,
                        'address'      => $data['address'] ?? $student->lead->address,
                        'parent_name'  => $data['parent_name'] ?? $student->lead->parent_name,
                        'parent_phone' => $data['parent_phone'] ?? $student->lead->parent_phone,
                    ]);
                }

                return $student->load('lead');
            });
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Gagal update data siswa (ID: {$student->id}): " . $e->getMessage());
            throw $e;
        }
    }
}
