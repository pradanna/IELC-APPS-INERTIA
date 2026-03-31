<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Branch extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'phone',
        'address',
    ];

    /**
     * Get the frontdesk staff for the branch.
     */
    public function frontdesks(): HasMany
    {
        return $this->hasMany(Frontdesk::class);
    }

    /**
     * Get the students for the branch through leads.
     */
    public function students(): HasManyThrough
    {
        return $this->hasManyThrough(Student::class, Lead::class);
    }

    /**
     * Get the monthly targets for the branch.
     */
    public function monthlyTargets(): HasMany
    {
        return $this->hasMany(MonthlyTarget::class);
    }

    /**
     * Get the leads for the branch.
     */
    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class);
    }

    /**
     * Get the rooms for the branch.
     */
    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class);
    }

    /**
     * The teachers that belong to the branch.
     */
    public function teachers(): BelongsToMany
    {
        return $this->belongsToMany(Teacher::class, 'branch_teacher')
            ->withPivot('is_primary')
            ->withTimestamps();
    }
}
