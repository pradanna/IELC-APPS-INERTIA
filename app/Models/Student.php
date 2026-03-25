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
        'lead_id',
        'nis',
        'status',
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
}
