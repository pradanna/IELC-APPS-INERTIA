<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'class_session_id',
        'student_id',
        'status',
        'late_minutes',
        'teacher_notes',
    ];

    /**
     * Get the class session that this attendance record belongs to.
     */
    public function classSession(): BelongsTo
    {
        return $this->belongsTo(ClassSession::class);
    }

    /**
     * Get the student that this attendance record belongs to.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
