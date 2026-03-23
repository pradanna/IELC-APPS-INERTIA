<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PtExam extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'duration_minutes',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'duration_minutes' => 'integer',
    ];

    public function questions(): HasMany
    {
        return $this->hasMany(PtQuestion::class);
    }

    public function ptSessions(): HasMany
    {
        return $this->hasMany(PtSession::class);
    }
}
