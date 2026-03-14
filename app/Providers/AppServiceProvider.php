<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Gate::define('superadmin', fn (User $user) => $user->role === 'superadmin');
        Gate::define('frontdesk', fn (User $user) => $user->role === 'frontdesk');
        Gate::define('teacher', fn (User $user) => $user->role === 'teacher');
        Gate::define('student', fn (User $user) => $user->role === 'student');
    }
}
