<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class StudyClass extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'package_id',
        'teacher_id',
    ];

    // Relasi ke paket yang dipilih (Master Package)
    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    // Relasi ke tabel guru/pengajar (Asumsi menggunakan model User)
    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    // Relasi Many-to-Many untuk melihat daftar siswa di kelas ini
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'student_study_class')->withTimestamps();
    }
}
