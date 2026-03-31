<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Traits\HasBranchScope;

class ClassSchedule extends Model
{
    use HasFactory, HasUuids, HasBranchScope;

    protected $fillable = [
        'study_class_id',
        'teacher_id',
        'room_id',
        'branch_id',
        'day_of_week',
        'start_time',
        'end_time',
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    /**
     * getDayLabelAttribute
     * 1 = Senin, ... 7 = Minggu
     */
    public function getDayLabelAttribute(): string
    {
        return [
            1 => 'Senin',
            2 => 'Selasa',
            3 => 'Rabu',
            4 => 'Kamis',
            5 => 'Jumat',
            6 => 'Sabtu',
            7 => 'Minggu',
        ][$this->day_of_week] ?? 'Unknown';
    }

    public function studyClass(): BelongsTo
    {
        return $this->belongsTo(StudyClass::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
