<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\Branch;
use App\Http\Requests\Admin\Teacher\StoreTeacherRequest;
use App\Http\Requests\Admin\Teacher\UpdateTeacherRequest;
use App\Actions\Teacher\CreateTeacherAction;
use App\Actions\Teacher\UpdateTeacherAction;
use App\Actions\Teacher\DeleteTeacherAction;
use App\Http\Resources\Admin\TeacherResource;
use Inertia\Inertia;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $teachers = Teacher::with(['user', 'branches'])
            ->latest()
            ->paginate(10);

        $branches = Branch::all();

        return Inertia::render('Teachers/Index', [
            'teachers' => TeacherResource::collection($teachers),
            'branches' => $branches,
            'stats' => [
                'total_teachers' => Teacher::count(),
                'total_branches' => Branch::count(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTeacherRequest $request, CreateTeacherAction $action)
    {
        $action->execute($request->validated());
        return redirect()->back()->with('success', 'Guru berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeacherRequest $request, Teacher $teacher, UpdateTeacherAction $action)
    {
        $action->execute($teacher, $request->validated());
        return redirect()->back()->with('success', 'Profil guru berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Teacher $teacher, DeleteTeacherAction $action)
    {
        $action->execute($teacher);
        return redirect()->back()->with('success', 'Data guru berhasil dihapus.');
    }
}
