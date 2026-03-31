<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StudyClass;
use App\Models\Package;
use App\Models\User;
use App\Models\Room;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\StudentScore;
use App\Models\ClassSchedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudyClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $branchId = $request->get('branch_id');
        $packageId = $request->get('package_id');
        $teacherId = $request->get('teacher_id');
        
        $classesQuery = StudyClass::with([
            'package', 
            'teachers', 
            'students.lead', 
            'students' => function($query) {
                $query->withCount(['attendances as total_attended' => function($q) {
                    $q->whereIn('status', ['present', 'late']);
                }]);
                $query->withAvg('scores', 'total_score');
            },
            'classSchedules.room', 
            'classSchedules.teacher.user'
        ]);
        
        if ($branchId && $branchId !== 'all') {
            $classesQuery->where('branch_id', $branchId);
        }

        if ($packageId && $packageId !== 'all') {
            $classesQuery->where('package_id', $packageId);
        }

        if ($teacherId && $teacherId !== 'all') {
            $classesQuery->whereHas('teachers', fn($q) => $q->where('teachers.id', $teacherId));
        }

        if ($request->filled('search')) {
            $search = $request->get('search');
            $classesQuery->where('name', 'like', "%{$search}%");
        }

        $classes = $classesQuery->paginate(10)->withQueryString();
        $packages = Package::all();
        $teachers = Teacher::with('user')->get();
        $rooms = Room::where('is_active', true)->get();
        $branches = \App\Models\Branch::all();

        return Inertia::render('StudyClasses/Index', [
            'studyClasses' => $classes,
            'packages' => $packages,
            'teachers' => $teachers,
            'rooms' => $rooms,
            'branches' => $branches,
            'filters' => $request->only(['branch_id', 'search', 'package_id', 'teacher_id']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $rules = [
            'name' => 'required|string|max:255',
            'package_id' => 'required|exists:packages,id',
            'teacher_ids' => 'required|array',
            'teacher_ids.*' => 'exists:teachers,id',
        ];

        if ($user->role === 'superadmin') {
            $rules['branch_id'] = 'required|exists:branches,id';
        }

        $validated = $request->validate($rules);

        // Security: For frontdesk, force their own branch_id
        if ($user->role !== 'superadmin') {
            $validated['branch_id'] = $user->frontdesk->branch_id;
        }

        $studyClass = StudyClass::create([
            'name' => $validated['name'],
            'package_id' => $validated['package_id'],
            'branch_id' => $validated['branch_id'],
        ]);
        
        if ($request->has('teacher_ids')) {
            $studyClass->teachers()->sync($request->teacher_ids);
        }

        return redirect()->back()->with('success', 'Class created successfully.');
    }

    public function storeSchedule(Request $request, StudyClass $studyClass)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'room_id' => 'required|exists:rooms,id',
            'day_of_week' => 'required|integer|min:1|max:7',
            'start_time' => 'required|string', // Format: HH:MM
        ]);

        $startTime = $validated['start_time'];
        $endTime = date('H:i', strtotime($startTime . ' +1 hour'));

        $studyClass->classSchedules()->create([
            'branch_id' => $studyClass->branch_id,
            'teacher_id' => $validated['teacher_id'],
            'room_id' => $validated['room_id'],
            'day_of_week' => $validated['day_of_week'],
            'start_time' => $startTime,
            'end_time' => $endTime,
        ]);

        return redirect()->back()->with('success', 'Jadwal berhasil ditambahkan.');
    }

    public function updateSchedule(Request $request, ClassSchedule $schedule)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'room_id' => 'required|exists:rooms,id',
            'day_of_week' => 'required|integer|min:1|max:7',
            'start_time' => 'required|string', // Format: HH:MM
        ]);

        $startTime = $validated['start_time'];
        $endTime = date('H:i', strtotime($startTime . ' +1 hour'));

        $schedule->update([
            'branch_id' => $schedule->studyClass->branch_id,
            'teacher_id' => $validated['teacher_id'],
            'room_id' => $validated['room_id'],
            'day_of_week' => $validated['day_of_week'],
            'start_time' => $startTime,
            'end_time' => $endTime,
        ]);

        return redirect()->back()->with('success', 'Jadwal berhasil diperbarui.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StudyClass $studyClass)
    {
        $user = $request->user();
        $rules = [
            'name' => 'required|string|max:255',
            'package_id' => 'required|exists:packages,id',
            'teacher_ids' => 'required|array',
            'teacher_ids.*' => 'exists:teachers,id',
        ];

        if ($user->role === 'superadmin') {
            $rules['branch_id'] = 'required|exists:branches,id';
        }

        $validated = $request->validate($rules);

        $data = [
            'name' => $validated['name'],
            'package_id' => $validated['package_id'],
        ];

        if ($user->role === 'superadmin') {
            $data['branch_id'] = $validated['branch_id'];
        }

        $studyClass->update($data);
        
        if ($request->has('teacher_ids')) {
            $studyClass->teachers()->sync($request->teacher_ids);
        }

        return redirect()->back()->with('success', 'Class updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StudyClass $studyClass)
    {
        $studyClass->delete();

        return redirect()->back()->with('success', 'Class deleted successfully.');
    }

    /**
     * Liat Detail Akademik Siswa per Kelas
     */
    public function getStudentAcademic(StudyClass $studyClass, Student $student)
    {
        $scores = StudentScore::where('study_class_id', $studyClass->id)
            ->where('student_id', $student->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $attendances = \App\Models\Attendance::where('student_id', $student->id)
            ->whereHas('classSession', function($q) use ($studyClass) {
                $q->where('study_class_id', $studyClass->id);
            })
            ->with('classSession')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'student' => $student->load('lead'),
            'scores' => $scores,
            'attendances' => $attendances,
            'summary' => [
                'avg_score' => $scores->avg('total_score'),
                'attendance_count' => $attendances->count(),
                'present_count' => $attendances->whereIn('status', ['present', 'late'])->count(),
                'attendance_percentage' => $attendances->count() > 0 
                    ? round(($attendances->whereIn('status', ['present', 'late'])->count() / $attendances->count()) * 100, 1) 
                    : 0
            ]
        ]);
    }
}
