<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SuperAdmin\DashboardController as SuperAdminDashboardController;
use App\Http\Controllers\SuperAdmin\MasterDataController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// 1. Root Route (Handles initial redirection)
Route::get('/', [DashboardController::class, 'root'])->name('root');

// 2. Central Dashboard Gateway (Redirects based on role)
Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

// 3. Profile Routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// 4. Role-Specific Route Groups
Route::middleware(['auth', 'verified'])->group(function () {

    // -- SUPERADMIN --
    Route::middleware('can:superadmin')->prefix('superadmin')->name('superadmin.')->group(function () {
        Route::get('/dashboard', SuperAdminDashboardController::class)->name('dashboard');
        Route::get('/master', [MasterDataController::class, 'index'])->name('master.index');
        // Define other superadmin-specific routes here...
    });

    // -- FRONTDESK --
    Route::middleware('can:frontdesk')->prefix('frontdesk')->name('frontdesk.')->group(function () {
        // Example:
        // Route::get('/dashboard', [App\Http\Controllers\Frontdesk\DashboardController::class, 'index'])->name('dashboard');
    });

    // -- TEACHER --
    Route::middleware('can:teacher')->prefix('teacher')->name('teacher.')->group(function () {
        // Example:
        // Route::get('/dashboard', [App\Http\Controllers\Teacher\DashboardController::class, 'index'])->name('dashboard');
    });

    // -- STUDENT --
    Route::middleware('can:student')->prefix('student')->name('student.')->group(function () {
        // Example:
        // Route::get('/dashboard', [App\Http\Controllers\Student\DashboardController::class, 'index'])->name('dashboard');
    });
});

require __DIR__.'/auth.php';
