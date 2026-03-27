<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) \Illuminate\Support\Str::uuid();
            }
        });
    }

    use HasFactory, Notifiable;

    protected $appends = ['name'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'uuid',
        'password',
        'role',
    ];

    /**
     * Get dynamic name from role profiles.
     */
    public function getNameAttribute(): string
    {
        if ($this->role === 'superadmin') return $this->superadmin->name ?? 'Admin';
        if ($this->role === 'frontdesk') return $this->frontdesk->name ?? 'Frontdesk';
        if ($this->role === 'teacher') return $this->teacher->name ?? 'Teacher';
        if ($this->role === 'student') return $this->student->lead->name ?? 'Student';
        return 'User';
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the superadmin profile associated with the user.
     */
    public function superadmin(): HasOne
    {
        return $this->hasOne(Superadmin::class);
    }

    /**
     * Get the frontdesk profile associated with the user.
     */
    public function frontdesk(): HasOne
    {
        return $this->hasOne(Frontdesk::class);
    }

    /**
     * Get the teacher profile associated with the user.
     */
    public function teacher(): HasOne
    {
        return $this->hasOne(Teacher::class);
    }

    /**
     * Get the student profile associated with the user.
     */
    public function student(): HasOne
    {
        return $this->hasOne(Student::class);
    }

    /**
     * Check if the user has a specific role.
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }
}
