<?php

use App\Http\Controllers\Crm\LeadController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SuperAdmin\DashboardController as SuperAdminDashboardController;
use App\Http\Controllers\Master\MasterBranchController;
use App\Http\Controllers\Master\MasterDataController;
use App\Http\Controllers\Master\MasterLeadSourceController;
use App\Http\Controllers\Master\MasterLevelController;
use App\Http\Controllers\Master\MasterPackageController;
use App\Http\Controllers\Master\LeadStatusController as MasterLeadStatusController;
use App\Http\Controllers\Master\MonthlyTargetController;
use App\Http\Controllers\PtExam\PtExamController;
use App\Models\PtExam;
use Illuminate\Support\Facades\Http;
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

    // Route::get('/crm/follow-up', [FollowUpController::class, 'index'])->name('crm.follow-up.index');

    // -- SUPERADMIN --
    Route::middleware('can:superadmin')->prefix('superadmin')->name('superadmin.')->group(function () {
        Route::get('/dashboard', SuperAdminDashboardController::class)->name('dashboard');
        Route::get('/master', [MasterDataController::class, 'index'])->name('master.index');
        Route::get('/crm/leads', [LeadController::class, 'index'])->name('crm.leads.index');
        Route::post('/crm/leads', [LeadController::class, 'store'])->name('crm.leads.store');
        Route::get('/crm/leads/search', [LeadController::class, 'search'])->name('crm.leads.search');
        Route::get('/crm/leads/export', [LeadController::class, 'export'])->name('crm.leads.export');
        Route::get('/crm/leads/{lead}', [LeadController::class, 'show'])->name('crm.leads.show');
        Route::put('/crm/leads/{lead}', [LeadController::class, 'update'])->name('crm.leads.update');
        Route::delete('/crm/leads/{lead}', [LeadController::class, 'destroy'])->name('crm.leads.destroy');
        Route::put('/crm/leads/{lead}/status', [LeadController::class, 'updateStatus'])->name('crm.leads.status.update');
        Route::post('/crm/leads/{lead}/followups', [LeadController::class, 'storeFollowup'])->name('crm.leads.followups.store');

        Route::get('/placement-tests', [PtExamController::class, 'index'])->name('placement-tests.index');
        Route::get('/placement-tests/create', [PtExamController::class, 'create'])->name('placement-tests.create');
        Route::post('/placement-tests', [PtExamController::class, 'store'])->name('placement-tests.store');

        Route::post('/master/branches', [MasterBranchController::class, 'store'])->name('branches.store');
        Route::put('/master/branches/{branch}', [MasterBranchController::class, 'update'])->name('branches.update');
        Route::delete('/master/branches/{branch}', [MasterBranchController::class, 'destroy'])->name('branches.destroy');

        Route::post('/master/levels', [MasterLevelController::class, 'store'])->name('levels.store');
        Route::put('/master/levels/{level}', [MasterLevelController::class, 'update'])->name('levels.update');
        Route::delete('/master/levels/{level}', [MasterLevelController::class, 'destroy'])->name('levels.destroy');

        Route::post('/master/packages', [MasterPackageController::class, 'store'])->name('packages.store');
        Route::put('/master/packages/{package}', [MasterPackageController::class, 'update'])->name('packages.update');
        Route::delete('/master/packages/{package}', [MasterPackageController::class, 'destroy'])->name('packages.destroy');

        Route::post('/master/lead-sources', [MasterLeadSourceController::class, 'store'])->name('lead-sources.store');
        Route::put('/master/lead-sources/{lead_source}', [MasterLeadSourceController::class, 'update'])->name('lead-sources.update');
        Route::delete('/master/lead-sources/{lead_source}', [MasterLeadSourceController::class, 'destroy'])->name('lead-sources.destroy');

        Route::get('/master/monthly-targets', [MonthlyTargetController::class, 'index'])->name('monthly-targets.index');
        Route::post('/master/monthly-targets', [MonthlyTargetController::class, 'store'])->name('monthly-targets.store');
        Route::put('/master/monthly-targets/{monthlyTarget}', [MonthlyTargetController::class, 'update'])->name('monthly-targets.update');
        Route::delete('/master/monthly-targets/{monthlyTarget}', [MonthlyTargetController::class, 'destroy'])->name('monthly-targets.destroy');

        Route::resource('/master/lead-statuses', MasterLeadStatusController::class)->names('master.lead-statuses');
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



require __DIR__ . '/auth.php';
