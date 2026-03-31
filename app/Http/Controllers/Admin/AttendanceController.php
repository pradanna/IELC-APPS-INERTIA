<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Admin\Attendance\UpdateClassAttendanceAction;
use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\ClassSchedule;
use App\Models\ClassSession;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Carbon;

class AttendanceController extends Controller
{
    /**
     * Display a listing of class sessions for attendance.
     */
    public function index(Request $request): Response
    {
        $dateFilter = $request->get('date', 'today'); // 'today' or 'yesterday'
        $date = $dateFilter === 'yesterday' ? Carbon::yesterday() : Carbon::today();
        $formattedDate = $date->toDateString();
        $dayOfWeek = $date->dayOfWeekIso; // 1 (Mon) - 7 (Sun)
        
        $branchId = $request->get('branch_id', auth()->user()->role === 'superadmin' ? Branch::first()?->id : auth()->user()->frontdesk?->branch_id);
        
        // 1. Fetch Existing Sessions (One-offs or already initiated recurring)
        $sessionsQuery = ClassSession::with(['studyClass.package.level', 'teacher.user', 'room'])
            ->withCount([
                'attendances as total_count',
                'attendances as present_count' => fn ($q) => $q->where('status', 'present')
            ])
            ->whereDate('date', $date)
            ->where('branch_id', $branchId);

        // 2. Fetch Recurring Schedules (Potential Sessions)
        $schedulesQuery = ClassSchedule::with(['studyClass.package.level', 'teacher.user', 'room'])
            ->where('day_of_week', $dayOfWeek)
            ->where('branch_id', $branchId);

        if ($request->filled('search')) {
            $search = $request->get('search');
            $sessionsQuery->where(function ($q) use ($search) {
                $q->whereHas('studyClass', function ($sq) use ($search) {
                    $sq->where('name', 'like', "%{$search}%");
                })->orWhereHas('teacher.user', function ($tq) use ($search) {
                    $tq->where('name', 'like', "%{$search}%");
                });
            });
            $schedulesQuery->where(function ($q) use ($search) {
                $q->whereHas('studyClass', function ($sq) use ($search) {
                    $sq->where('name', 'like', "%{$search}%");
                })->orWhereHas('teacher.user', function ($tq) use ($search) {
                    $tq->where('name', 'like', "%{$search}%");
                });
            });
        }

        $sessions = $sessionsQuery->get();
        $schedules = $schedulesQuery->get();

        // MERGE LOGIC: Convert both to a standard format for the cards
        // Get sessions with attendance counts
        $formattedSessions = $sessions->map(function ($s) {
            $arr = $s->toArray();
            $arr['type'] = 'session';
            $arr['status'] = $s->status ?? 'pending';
            // Counts are already provided by withCount
            return $arr;
        })->toArray();

        $merged = $formattedSessions;

        // Add potential sessions from schedules if they don't have a session entry yet
        foreach ($schedules as $schedule) {
            $hasSession = $sessions->contains(function ($s) use ($schedule) {
                return $s->room_id == $schedule->room_id && 
                       Carbon::parse($s->start_time)->format('H:i') == Carbon::parse($schedule->start_time)->format('H:i');
            });

            if (!$hasSession) {
                $arr = $schedule->toArray();
                $arr['type'] = 'schedule';
                $arr['date'] = $formattedDate;
                $arr['status'] = 'pending'; // Visual indicator
                $merged[] = $arr;
            }
        }

        // Sort by start_time
        usort($merged, fn($a, $b) => strcmp($a['start_time'], $b['start_time']));

        return Inertia::render('Admin/Attendances/Index', [
            'sessions' => $merged,
            'branches' => auth()->user()->role === 'superadmin' ? Branch::all() : [],
            'filters' => array_merge($request->only(['date', 'branch_id', 'search']), ['formatted_date' => $formattedDate]),
        ]);
    }

    /**
     * Initiate attendance from a schedule template (Lazy Creation).
     */
    public function initiate(string $type, $id, Request $request, \App\Actions\Admin\Schedule\CreateSessionFromScheduleAction $action)
    {
        $date = $request->get('date', now()->toDateString());
        $session = null;

        if ($type === 'schedule') {
            $schedule = ClassSchedule::findOrFail($id);
            $session = $action->execute($schedule, $date);
        } else {
            $session = ClassSession::findOrFail($id);
        }

        // INITIALIZE ATTENDANCE: Snapshot students into the session
        $students = $session->studyClass->students()->get();
        
        foreach ($students as $student) {
            Attendance::updateOrCreate(
                [
                    'class_session_id' => $session->id,
                    'student_id' => $student->id,
                ],
                [
                    'status' => 'present', // Default to present
                ]
            );
        }

        return redirect()->route('admin.attendances.show', $session->id);
    }

    /**
     * Show the attendance sheet for a specific session.
     */
    public function show(ClassSession $classSession): Response
    {
        $classSession->load(['studyClass.students.user', 'studyClass.students.lead', 'teacher.user', 'room', 'branch']);
        
        // Load existing attendances to populate the form
        $attendances = Attendance::where('class_session_id', $classSession->id)->get();

        return Inertia::render('Admin/Attendances/Show', [
            'session' => $classSession,
            'existingAttendances' => $attendances,
        ]);
    }

    /**
     * Store attendance records.
     */
    public function store(Request $request, ClassSession $classSession, UpdateClassAttendanceAction $action)
    {
        $validated = $request->validate([
            'topic_taught' => 'required|string',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'required|in:present,absent,late,excused',
            'attendances.*.late_minutes' => 'nullable|integer|min:0',
            'attendances.*.teacher_notes' => 'nullable|string',
        ]);

        $action->execute($classSession, $validated);

        return redirect()->route('admin.attendances.index', ['branch_id' => $classSession->branch_id])
            ->with('success', 'Attendance recorded successfully.');
    }

    /**
     * Search for active students to add as fill-ins.
     */
    public function searchStudents(Request $request)
    {
        $search = $request->get('search');
        
        if (strlen($search) < 3) {
            return response()->json([]);
        }

        $students = \App\Models\Student::with('lead.branch')
            ->where('status', 'active')
            ->where(function ($q) use ($search) {
                $q->where('nis', 'like', "%{$search}%")
                  ->orWhereHas('lead', function ($ql) use ($search) {
                      $ql->where('name', 'like', "%{$search}%");
                  });
            })
            ->limit(5)
            ->get();

        return $students->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->lead?->name ?? 'Unknown',
                'nis' => $s->nis,
                'branch' => $s->lead?->branch?->name ?? 'N/A',
            ];
        });
    }

    /**
     * Export attendance sheet as PDF.
     */
    public function exportPdf(\App\Models\ClassSession $classSession)
    {
        $classSession->load([
            'studyClass.package.level', 
            'attendances.student.lead', 
            'teacher.user', 
            'room', 
            'branch'
        ]);

        $attendances = $classSession->attendances;
        $stats = [
            'total' => $attendances->count(),
            'present' => $attendances->where('status', 'present')->count(),
            'absent' => $attendances->where('status', 'absent')->count(),
            'late' => $attendances->where('status', 'late')->count(),
            'excused' => $attendances->where('status', 'excused')->count(),
        ];

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.attendance', [
            'session' => $classSession,
            'attendances' => $attendances,
            'stats' => $stats,
        ]);

        $filename = "Attendance_{$classSession->studyClass->name}_" . \Illuminate\Support\Carbon::parse($classSession->date)->format('Y-m-d') . ".pdf";
        
        return $pdf->stream($filename);
    }
}
