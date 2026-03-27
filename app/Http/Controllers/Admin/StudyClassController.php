<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StudyClass;
use App\Models\Package;
use App\Models\User;
use App\Models\Room;
use App\Models\Teacher;
use App\Models\ClassSchedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudyClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classes = StudyClass::with(['package', 'teachers', 'students.lead', 'classSchedules.room', 'classSchedules.teacher.user'])->paginate(10);
        $packages = Package::all();
        $teachers = Teacher::with('user')->get(); // Menggunakan model Teacher agar lebih detail sesuai migrasi
        $rooms = Room::where('is_active', true)->get();

        return Inertia::render('StudyClasses/Index', [
            'studyClasses' => $classes,
            'packages' => $packages,
            'teachers' => $teachers,
            'rooms' => $rooms,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'package_id' => 'required|exists:packages,id',
            'teacher_ids' => 'required|array',
            'teacher_ids.*' => 'exists:teachers,id',
        ]);

        $studyClass = StudyClass::create($request->only('name', 'package_id'));
        
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
        $request->validate([
            'name' => 'required|string|max:255',
            'package_id' => 'required|exists:packages,id',
            'teacher_ids' => 'required|array',
            'teacher_ids.*' => 'exists:teachers,id',
        ]);

        $studyClass->update($request->only('name', 'package_id'));
        
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
}
