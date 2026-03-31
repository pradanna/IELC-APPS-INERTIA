<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\ClassSchedule;
use App\Models\ClassSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Date handling (Selected date or today)
        $selectedDate = $request->input('date', now()->toDateString());
        $carbonDate = Carbon::parse($selectedDate);
        $dayOfWeek = $carbonDate->dayOfWeekIso; // 1 (Mon) - 7 (Sun)
        $isPast = $carbonDate->isPast() && !$carbonDate->isToday();

        // Branch Isolation (Standard approach)
        $branchId = $request->input('branch_id');
        if ($user->role === 'frontdesk' && $user->frontdesk) {
            $branchId = $user->frontdesk->branch_id;
        }

        // Default to first branch if none provided (especially for superadmin)
        if (!$branchId) {
            $firstBranch = \App\Models\Branch::orderBy('id')->first();
            $branchId = $firstBranch ? $firstBranch->id : null;
        }

        // Fetch Rooms (Sorted by name Room 1, Room 2, etc.)
        $roomsQuery = Room::where('is_active', true);
        if ($branchId && $branchId !== 'all') {
            $roomsQuery->where('branch_id', $branchId);
        }
        $rooms = $roomsQuery->orderByRaw('CAST(SUBSTRING(name, 6) AS UNSIGNED) ASC')->get();

        // Fetch Recurring Schedules (Daily Template) - HIDDEN IF IN PAST
        $schedules = collect([]);
        if (!$isPast) {
            $schedulesQuery = ClassSchedule::with(['studyClass.package', 'teacher.user', 'room'])
                ->where('day_of_week', $dayOfWeek);
            
            if ($branchId && $branchId !== 'all') {
                $schedulesQuery->where('branch_id', $branchId);
            }
            $schedules = $schedulesQuery->orderBy('start_time', 'asc')->get();
        }

        // Fetch Actual Sessions (Overrides/History)
        $sessionsQuery = ClassSession::with(['studyClass.package', 'teacher.user', 'room'])
            ->whereDate('date', $selectedDate);
            
        if ($branchId && $branchId !== 'all') {
            $sessionsQuery->where('branch_id', $branchId);
        }
        $sessions = $sessionsQuery->orderBy('start_time', 'asc')->get();

        // Data for Modal (Classes and Teachers for this branch)
        $classes = \App\Models\StudyClass::with('package')
            ->where('branch_id', $branchId)
            ->get();
            
        $teachers = \App\Models\Teacher::with(['user', 'branches'])
            ->get()
            ->sortByDesc(fn($teacher) => $teacher->branches->contains('id', $branchId))
            ->values();

        return Inertia::render('Admin/Schedules/Index', [
            'filters' => [
                'date' => $selectedDate,
                'branch_id' => $branchId,
                'isPast' => $isPast,
            ],
            'rooms' => $rooms,
            'schedules' => $schedules,
            'sessions' => $sessions,
            'branches' => \App\Models\Branch::all(),
            'studyClasses' => $classes,
            'teachers' => $teachers,
            'currentDayOfWeek' => $dayOfWeek,
        ]);
    }

    public function store(\App\Http\Requests\Admin\Schedule\StoreScheduleRequest $request, \App\Actions\Admin\Schedule\StoreScheduleAction $action)
    {
        $action->execute($request->validated());

        return redirect()->back()->with('success', 'Jadwal berhasil disimpan.');
    }

    public function move(\App\Http\Requests\Admin\Schedule\MoveScheduleRequest $request, \App\Actions\Admin\Schedule\MoveScheduleAction $action)
    {
        $action->execute($request->validated());

        return redirect()->back()->with('success', 'Jadwal berhasil dipindah.');
    }

    public function update(\App\Http\Requests\Admin\Schedule\UpdateScheduleRequest $request, \App\Actions\Admin\Schedule\UpdateScheduleAction $action)
    {
        $action->execute($request->validated());

        return redirect()->back()->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(\App\Http\Requests\Admin\Schedule\DestroyScheduleRequest $request, \App\Actions\Admin\Schedule\DeleteScheduleAction $action)
    {
        $action->execute($request->validated());

        return redirect()->back()->with('success', 'Jadwal berhasil dihapus.');
    }

    public function downloadPdf(Request $request)
    {
        $user = $request->user();
        $selectedDate = $request->input('date', now()->toDateString());
        $carbonDate = \Carbon\Carbon::parse($selectedDate);
        $dayOfWeek = $carbonDate->dayOfWeekIso;
        $isPast = $carbonDate->isPast() && !$carbonDate->isToday();

        $branchId = $request->input('branch_id');
        if ($user->role === 'frontdesk' && $user->frontdesk) {
            $branchId = $user->frontdesk->branch_id;
        }

        $branch = \App\Models\Branch::find($branchId);
        if (!$branch) {
            $branch = \App\Models\Branch::orderBy('id')->first();
            $branchId = $branch->id;
        }

        $rooms = Room::where('is_active', true)
            ->where('branch_id', $branchId)
            ->orderByRaw('CAST(SUBSTRING(name, 6) AS UNSIGNED) ASC')
            ->get();

        $schedules = collect([]);
        if (!$isPast) {
            $schedules = ClassSchedule::with(['studyClass.package', 'teacher.user', 'room'])
                ->where('branch_id', $branchId)
                ->where('day_of_week', $dayOfWeek)
                ->get();
        }

        $sessions = ClassSession::with(['studyClass.package', 'teacher.user', 'room'])
            ->where('branch_id', $branchId)
            ->whereDate('date', $selectedDate)
            ->get();

        $timeSlots = [];
        for ($i = 9; $i <= 19; $i++) {
            $timeSlots[] = str_pad($i, 2, '0', STR_PAD_LEFT) . ':00';
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.schedule', [
            'branch' => $branch,
            'selectedDate' => $selectedDate,
            'rooms' => $rooms,
            'schedules' => $schedules,
            'sessions' => $sessions,
            'timeSlots' => $timeSlots,
            'carbonDate' => $carbonDate,
        ]);

        // F4 Standard (Landscape): 330mm x 210mm
        // Points = mm * 2.83465
        $width = 330 * 2.83465;
        $height = 210 * 2.83465;
        $pdf->setPaper([0, 0, $width, $height]);

        $fileName = "Schedule_" . str_replace(' ', '_', ($branch->name ?? 'Branch')) . "_" . $selectedDate . ".pdf";
        return $pdf->stream($fileName);
    }
}

