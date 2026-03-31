<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Level extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Get the leads interested in this level.
     */
    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class, 'interest_level_id');
    }

    /**
     * Get the packages for this level.
     * Note: The 'Package' model and its migration need to be created.
     */
    public function packages(): HasMany
    {
        // Assuming a 'level_id' foreign key on the 'packages' table.
        return $this->hasMany(Package::class);
    }
}
