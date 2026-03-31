<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Lead;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\LeadStatus;
use App\Models\Package;
use App\Models\MonthlyTarget;
use App\Http\Resources\Dashboard\BranchPerformanceResource;
use App\Http\Resources\Dashboard\CrmPipelineResource;
use App\Http\Resources\Dashboard\TopPackageResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @return \Inertia\Response
     */
    public function __invoke(Request $request)
    {
        $user = auth()->user();
        
        if ($user->role === 'superadmin') {
            return $this->superadminDashboard();
        }

        if ($user->role === 'frontdesk' && $user->frontdesk) {
            return $this->frontdeskDashboard($user->frontdesk->branch_id);
        }

        // Default or other roles
        return redirect()->route('profile.edit');
    }

    protected function superadminDashboard()
    {
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        // 1. Core KPIs
        $stats = [
            [
                'name' => 'Total Students',
                'stat' => Student::count(),
                'changeType' => 'increase',
            ],
            [
                'name' => 'Total Teachers',
                'stat' => Teacher::count(),
                'changeType' => 'increase',
            ],
            [
                'name' => 'Total Branches',
                'stat' => Branch::count(),
                'changeType' => 'increase',
            ],
            [
                'name' => 'New Leads (This Month)',
                'stat' => Lead::whereMonth('created_at', $currentMonth)
                    ->whereYear('created_at', $currentYear)
                    ->count(),
                'changeType' => 'decrease',
            ],
        ];

        // 2. Branch Performance (Counting converted leads)
        $branchPerformanceData = Branch::withCount(['leads as enrolled' => function ($query) {
                $query->whereHas('student');
            }])
            ->with(['monthlyTargets' => function($query) use ($currentMonth, $currentYear) {
                $query->where('month', $currentMonth)->where('year', $currentYear);
            }])
            ->get()
            ->each(function($branch) {
                $target = $branch->monthlyTargets->first();
                $branch->goal = $target ? $target->target_enrolled : 0;
            });

        // 3. CRM Pipeline
        $crmPipelineData = LeadStatus::withCount('leads')->get();

        // 4. Top Packages
        $topPackagesData = Package::query()
            ->withCount(['studyClasses as sales' => function ($query) {
                $query->select(DB::raw('count(student_study_class.student_id)'))
                    ->join('student_study_class', 'study_classes.id', '=', 'student_study_class.study_class_id');
            }])
            ->orderByDesc('sales')
            ->take(5)
            ->get()
            ->each(function($package) {
                 $package->price = 'Rp ' . number_format($package->price, 0, ',', '.');
            });

        return Inertia::render('Dashboard/Superadmin', [
            'stats' => $stats,
            'branchPerformance' => BranchPerformanceResource::collection($branchPerformanceData),
            'crmPipeline' => CrmPipelineResource::collection($crmPipelineData),
            'topPackages' => TopPackageResource::collection($topPackagesData),
        ]);
    }

    protected function frontdeskDashboard($branchId)
    {
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        $branch = Branch::findOrFail($branchId);

        // 1. Branch KPIs
        $stats = [
            [
                'name' => 'Branch Students',
                'stat' => Student::whereHas('lead', fn($q) => $q->where('branch_id', $branchId))->count(),
                'changeType' => 'increase',
            ],
            [
                'name' => 'New Leads (This Month)',
                'stat' => Lead::where('branch_id', $branchId)
                    ->whereMonth('created_at', $currentMonth)
                    ->whereYear('created_at', $currentYear)
                    ->count(),
                'changeType' => 'increase',
            ],
            [
                'name' => 'Today\'s Sessions',
                'stat' => \App\Models\ClassSession::where('branch_id', $branchId)
                    ->whereDate('date', Carbon::today())
                    ->count(),
                'changeType' => 'neutral',
            ],
            [
                'name' => 'Pending Follow-ups',
                'stat' => \App\Models\LeadFollowup::whereHas('lead', fn($q) => $q->where('branch_id', $branchId))
                    ->where('status', 'pending')
                    ->whereDate('scheduled_at', '<=', Carbon::today())
                    ->count(),
                'changeType' => 'decrease',
            ],
        ];

        // 2. Recent Leads for this branch
        $recentLeads = Lead::where('branch_id', $branchId)
            ->with(['leadStatus', 'leadSource'])
            ->orderByDesc('created_at')
            ->take(5)
            ->get();

        // 3. Upcoming Follow-ups
        $upcomingFollowups = \App\Models\LeadFollowup::whereHas('lead', fn($q) => $q->where('branch_id', $branchId))
            ->with('lead')
            ->where('status', 'pending')
            ->orderBy('scheduled_at')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard/Frontdesk', [
            'branchName' => $branch->name,
            'stats' => $stats,
            'recentLeads' => $recentLeads,
            'upcomingFollowups' => $upcomingFollowups,
        ]);
    }
}