<?php

use App\Http\Controllers\Crm\LeadController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SuperAdmin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Master\MasterBranchController;
use App\Http\Controllers\Master\MasterDataController;
use App\Http\Controllers\Master\MasterLeadSourceController;
use App\Http\Controllers\Master\MasterLevelController;
use App\Http\Controllers\Master\MasterPackageController;
use App\Http\Controllers\Master\LeadStatusController as MasterLeadStatusController;
use App\Http\Controllers\Master\MonthlyTargetController;
use App\Http\Controllers\PtExam\PtExamController;
use App\Http\Controllers\PtExam\PtQuestionGroupController;
use App\Http\Controllers\PtExam\PtQuestionController;
use App\Models\PtExam;
use App\Http\Controllers\Public\PlacementTestController;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Finance\FinanceDashboardController;

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
Route::get('/', fn() => redirect()->route('login'))->name('root');

// 2. Central Dashboard Gateway (Redirects based on role)
Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

// Public Placement Test Route (Magic Link)
Route::get('/placement-test/{slug}/{token}', [PlacementTestController::class, 'show'])->name('public.placement-test.landing');
Route::post('/placement-test/{slug}/{token}/start', [PlacementTestController::class, 'start'])->name('public.placement-test.start');
Route::get('/placement-test/{slug}/{token}/exam', [PlacementTestController::class, 'exam'])->name('public.placement-test.exam');
Route::post('/placement-test/{slug}/{token}/submit', [PlacementTestController::class, 'submit'])->name('public.placement-test.submit');
Route::get('/placement-test/{slug}/{token}/result', [PlacementTestController::class, 'result'])->name('public.placement-test.result');
Route::get('/placement-test/{slug}/{token}/review', [PlacementTestController::class, 'review'])->name('public.placement-test.review');

// 3. Profile Routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// 4. Role-Specific Route Groups
Route::middleware(['auth', 'verified'])->group(function () {

    // Route::get('/crm/follow-up', [FollowUpController::class, 'index'])->name('crm.follow-up.index');

    // -- ADMIN & FRONTDESK --
    Route::middleware(['role:superadmin,frontdesk'])->name('admin.')->group(function () {
        Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');
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
        Route::get('/placement-tests/active', [PtExamController::class, 'getActiveExams'])->name('placement-tests.active');
        Route::get('/placement-tests/template/download', [PtQuestionController::class, 'downloadTemplate'])->name('placement-tests.template.download');
        Route::post('/placement-tests', [PtExamController::class, 'store'])->name('placement-tests.store');
        Route::get('/placement-tests/{ptExam}', [PtExamController::class, 'show'])->name('placement-tests.show');
        Route::put('/placement-tests/{ptExam}', [PtExamController::class, 'update'])->name('placement-tests.update');
        Route::delete('/placement-tests/{ptExam}', [PtExamController::class, 'destroy'])->name('placement-tests.destroy');
        Route::post('/placement-tests/{ptExam}/questions', [PtQuestionController::class, 'store'])->name('placement-tests.questions.store');
        Route::post('/placement-tests/{ptExam}/questions/import', [PtQuestionController::class, 'import'])->name('placement-tests.questions.import');
        Route::put('/placement-tests/{ptExam}/questions/{question}', [PtQuestionController::class, 'update'])->name('placement-tests.questions.update');
        Route::delete('/placement-tests/{ptExam}/questions/{question}', [PtQuestionController::class, 'destroy'])->name('placement-tests.questions.destroy');
        Route::post('/placement-tests/{ptExam}/question-groups', [PtQuestionGroupController::class, 'store'])->name('placement-tests.question-groups.store');
        Route::put('/placement-tests/{ptExam}/question-groups/{ptQuestionGroup}', [PtQuestionGroupController::class, 'update'])->name('placement-tests.question-groups.update');
        Route::delete('/placement-tests/{ptExam}/question-groups/{ptQuestionGroup}', [PtQuestionGroupController::class, 'destroy'])->name('placement-tests.question-groups.destroy');

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




        // ... dalam grup middleware auth
        Route::get('/finance/dashboard', [FinanceDashboardController::class, 'index'])->name('finance.dashboard');
        Route::post('/finance/invoices', [FinanceDashboardController::class, 'storeInvoice'])->name('finance.invoices.store');
        Route::put('/finance/invoices/{invoice}', [FinanceDashboardController::class, 'updateInvoice'])->name('finance.invoices.update');
        Route::put('/finance/invoices/{invoice}/status', [FinanceDashboardController::class, 'updateStatus'])->name('finance.invoices.update-status');

        Route::get('/admin/finance/invoices/{invoice}/pdf', [FinanceDashboardController::class, 'downloadPdf'])->name('admin.finance.invoices.pdf');
    });

    // -- FRONTDESK --
    Route::middleware('role:frontdesk')->prefix('frontdesk')->name('frontdesk.')->group(function () {
        // Example:
        // Route::get('/dashboard', [App\Http\Controllers\Frontdesk\DashboardController::class, 'index'])->name('dashboard');
    });

    // -- TEACHER --
    Route::middleware('role:teacher')->prefix('teacher')->name('teacher.')->group(function () {
        // Example:
        // Route::get('/dashboard', [App\Http\Controllers\Teacher\DashboardController::class, 'index'])->name('dashboard');
    });

    // -- STUDENT --
    Route::middleware('role:student')->prefix('student')->name('student.')->group(function () {
        // Example:
        // Route::get('/dashboard', [App\Http\Controllers\Student\DashboardController::class, 'index'])->name('dashboard');
    });
});



require __DIR__ . '/auth.php';
