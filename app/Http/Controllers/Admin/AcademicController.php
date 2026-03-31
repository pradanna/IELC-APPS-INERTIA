<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StudyClass;
use App\Models\StudentScore;
use App\Actions\Admin\Academic\MassStoreScoreAction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AcademicController extends Controller
{
    /**
     * Display a listing of classes for academic recording.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = StudyClass::with(['package.level', 'teachers.user'])
            ->withCount('students');

        // Branch filtering
        if ($user->role !== 'superadmin') {
            $branchId = $user->frontdesk?->branch_id ?? $user->teacher?->branches()->first()?->id;
            if ($branchId) {
                $query->where('branch_id', $branchId);
            }
        } elseif ($request->filled('branch_id') && $request->branch_id !== 'all') {
            $query->where('branch_id', $request->branch_id);
        }

        // Teacher filtering (if teacher, show only their classes)
        if ($user->role === 'teacher') {
            $query->whereHas('teachers', fn($q) => $q->where('teachers.id', $user->teacher->id));
        }

        // Search filtering
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where('name', 'like', "%{$search}%");
        }

        $classes = $query->latest()->paginate(12)->withQueryString();
        $branches = \App\Models\Branch::all();

        return Inertia::render('Admin/Academic/Index', [
            'classes' => $classes,
            'branches' => $branches,
            'filters' => $request->only(['branch_id', 'search']),
        ]);
    }

    /**
     * Show the mass entry form for a specific class.
     */
    public function show(StudyClass $studyClass, Request $request)
    {
        $assessmentType = $request->get('type', 'quiz');
        
        // Find existing sessions for this assessment type
        $existingSessionNumbers = StudentScore::where('study_class_id', $studyClass->id)
            ->where('assessment_type', $assessmentType)
            ->distinct()
            ->pluck('session_number')
            ->sort()
            ->values();

        // Determine current session number
        // If 'session' query param is provided, use it. Otherwise, use the latest one or 1.
        $sessionNumber = (int) $request->get('session', $existingSessionNumbers->last() ?? 1);

        $studyClass->load(['students.lead', 'package.level', 'branch']);
        
        // Load scores for this specific session
        $existingScores = StudentScore::where('study_class_id', $studyClass->id)
            ->where('assessment_type', $assessmentType)
            ->where('session_number', $sessionNumber)
            ->get()
            ->keyBy('student_id');

        return Inertia::render('Admin/Academic/MassEntry', [
            'studyClass' => $studyClass,
            'existingScores' => $existingScores,
            'assessmentType' => $assessmentType,
            'sessionNumber' => $sessionNumber,
            'existingSessions' => $existingSessionNumbers,
            'availableTypes' => [
                ['id' => 'quiz', 'name' => 'Quiz / Unit Test'],
                ['id' => 'mid_term', 'name' => 'Mid-Term Exam'],
                ['id' => 'final_term', 'name' => 'Final Exam'],
                ['id' => 'simulation', 'name' => 'Simulation / Mock Test'],
            ]
        ]);
    }

    /**
     * Show a matrix report of all scores for a class.
     */
    public function report(StudyClass $studyClass)
    {
        $studyClass->load(['students.lead', 'package.level', 'branch']);
        
        $scores = StudentScore::where('study_class_id', $studyClass->id)
            ->get()
            ->groupBy('student_id');

        return Inertia::render('Admin/Academic/Report', [
            'studyClass' => $studyClass,
            'allScores' => $scores,
            'assessmentTypes' => [
                'quiz' => 'Quiz',
                'mid_term' => 'Mid-Term',
                'final_term' => 'Final',
                'simulation' => 'Simulation'
            ]
        ]);
    }

    /**
     * Export academic reports as PDF.
     */
    public function exportPdf(StudyClass $studyClass, Request $request)
    {
        $type = $request->get('type', 'mid_term');
        $studentId = $request->get('student_id');
        $sessionNumber = $request->get('session');

        $studyClass->load(['package.level', 'branch']);
        
        $query = StudentScore::with('student.lead')
            ->where('study_class_id', $studyClass->id)
            ->where('assessment_type', $type);

        if ($sessionNumber) {
            $query->where('session_number', $sessionNumber);
        }

        if ($studentId) {
            $query->where('student_id', $studentId);
        }

        $scores = $query->get();

        if ($scores->isEmpty()) {
            return redirect()->back()->with('error', 'No scores found for the selected type.');
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.mass-student-scores', [
            'studyClass' => $studyClass,
            'scores' => $scores,
            'type' => $type,
            'logoBase64' => null // Can add logic for logo here
        ]);

        $filename = "Academic_Report_{$studyClass->name}_{$type}.pdf";
        return $pdf->stream($filename);
    }

    /**
     * Store mass academic records.
     */
    public function store(Request $request, StudyClass $studyClass, MassStoreScoreAction $action)
    {
        $validated = $request->validate([
            'assessment_type' => 'required|string',
            'session_number'  => 'required|integer|min:1',
            'scores' => 'required|array',
            'scores.*.student_id' => 'required|exists:students,id',
            'scores.*.total_score' => 'nullable|numeric|min:0|max:100',
            'scores.*.final_feedback' => 'nullable|string',
            'scores.*.score_details' => 'nullable|array',
        ]);

        $action->execute(
            $studyClass->id,
            $validated['assessment_type'],
            $validated['session_number'],
            $validated['scores']
        );

        return redirect()->route('admin.academic.index')
            ->with('success', "Academic records for {$studyClass->name} updated.");
    }
}
