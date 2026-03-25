<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Lead extends Model
{
    use HasFactory, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'branch_id',
        'name',
        'dob',
        'phone',
        'email',
        'address',
        'parent_name',
        'parent_phone',
        'lead_source_id',
        'lead_status_id',
        'notes',
        'interest_level_id',
        'interest_package_id',
        'temperature',
        'joined_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'dob' => 'date',
        'joined_at' => 'datetime',
    ];

    /**
     * Get the branch that manages this lead.
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * Get the level the lead is interested in.
     */
    public function interestLevel(): BelongsTo
    {
        return $this->belongsTo(Level::class, 'interest_level_id');
    }

    /**
     * Get the package the lead is interested in.
     */
    public function interestPackage(): BelongsTo
    {
        return $this->belongsTo(Package::class, 'interest_package_id');
    }

    /**
     * Get the source of the lead.
     */
    public function leadSource(): BelongsTo
    {
        return $this->belongsTo(LeadSource::class);
    }

    /**
     * Get the status of the lead.
     */
    public function leadStatus(): BelongsTo
    {
        return $this->belongsTo(LeadStatus::class);
    }


    /**
     * Get the follow-ups for the lead.
     */
    public function followups()
    {
        // Sesuaikan 'LeadFollowup::class' dengan nama model follow-up Anda jika berbeda
        return $this->hasMany(\App\Models\LeadFollowup::class);
    }

    /**
     * Get the options for the activity log.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            // Tentukan secara spesifik field yang penting untuk di-log perubahannya
            ->logOnly(['lead_status_id', 'branch_id', 'name', 'phone', 'lead_source_id', 'notes'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) => "Lead has been {$eventName}");
    }

    /**
     * Get the placement test sessions for the lead.
     */
    public function ptSessions(): HasMany
    {
        return $this->hasMany(PtSession::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }
}
