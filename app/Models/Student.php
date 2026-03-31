<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lead_id',
        'nis',
        'status',
        'profile_picture',
    ];

    // Relasi ke data prospek / profil awal siswa
    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    // Relasi Many-to-Many ke kelas yang diikuti siswa
    public function studyClasses(): BelongsToMany
    {
        return $this->belongsToMany(StudyClass::class, 'student_study_class')->withTimestamps();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scores()
    {
        return $this->hasMany(StudentScore::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
