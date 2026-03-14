<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Lead;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @return \Inertia\Response
     */
    public function __invoke(Request $request)
    {
        // Per ARCHITECTURE_RULES, simple data reads are allowed in controllers.
        $stats = [
            [
                'name' => 'Total Students',
                'stat' => Student::count(),
                'change' => '122', // Dummy data for change
                'changeType' => 'increase',
            ],
            [
                'name' => 'Total Teachers',
                'stat' => Teacher::count(),
                'change' => '5', // Dummy data for change
                'changeType' => 'increase',
            ],
            [
                'name' => 'Total Branches',
                'stat' => Branch::count(),
                'change' => '3', // Dummy data for change
                'changeType' => 'increase',
            ],
            [
                'name' => 'New Leads (This Month)',
                'stat' => Lead::whereMonth('created_at', Carbon::now()->month)->count(),
                'change' => '10', // Dummy data for change
                'changeType' => 'decrease',
            ],
        ];

        return Inertia::render('Dashboard/Superadmin', [
            'stats' => $stats,
        ]);
    }
}
