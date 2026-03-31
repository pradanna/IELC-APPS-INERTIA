<?php

namespace App\Models;

use App\Traits\HasBranchScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StudyClass extends Model
{
    use HasFactory, HasBranchScope;

    protected $fillable = [
        'branch_id',
        'name',
        'class_color',
        'package_id',
    ];

    public function classSchedules(): HasMany
    {
        return $this->hasMany(ClassSchedule::class)->orderBy('start_time', 'asc');
    }

    public function classSessions(): HasMany
    {
        return $this->hasMany(ClassSession::class)->orderBy('date', 'asc')->orderBy('start_time', 'asc');
    }

    // Relasi ke paket yang dipilih (Master Package)
    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    // Relasi Many-to-Many ke tabel guru/pengajar (Teacher profile)
    public function teachers(): BelongsToMany
    {
        return $this->belongsToMany(Teacher::class, 'study_class_teacher', 'study_class_id', 'teacher_id')->withTimestamps();
    }

    // Relasi Many-to-Many untuk melihat daftar siswa di kelas ini
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'student_study_class')->withTimestamps();
    }
}
