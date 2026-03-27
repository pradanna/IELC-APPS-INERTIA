<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClassSession extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'study_class_id',
        'date',
        'start_time',
        'end_time',
        'room_id',
        'teacher_id',
        'status',
        'topic_taught',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function studyClass(): BelongsTo
    {
        return $this->belongsTo(StudyClass::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}
