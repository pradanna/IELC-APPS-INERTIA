<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['level_id', 'name', 'description', 'type', 'sessions_count', 'duration_days', 'price', 'is_active'];

    // Relasi ke Level
    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    // Relasi ke Leads yang berminat pada paket ini
    public function interestedLeads(): HasMany
    {
        return $this->hasMany(Lead::class, 'interest_package_id');
    }

    public function studyClasses(): HasMany
    {
        return $this->hasMany(StudyClass::class);
    }
}
