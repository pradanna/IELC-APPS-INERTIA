<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentScore;
use App\Http\Requests\Student\StoreStudentScoreRequest;
use App\Actions\Student\StoreStudentScoreAction;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class StudentScoreController extends Controller
{
    /**
     * Store a newly created student score.
     */
    public function store(StoreStudentScoreRequest $request, Student $student, StoreStudentScoreAction $action)
    {
        // Use the action for mutations
        $action->execute($student, $request->validated());

        return redirect()->back()->with('success', 'Skor progres report berhasil disimpan.');
    }

    /**
     * Generate and download the PDF progress report.
     */
    public function downloadPdf(StudentScore $score)
    {
        $score->load(['student.lead', 'studyClass.package.level']);

        // Convert logo to base64 for better DomPDF compatibility
        $logoPath = public_path('assets/images/local/logo-full.png');
        $logoData = "";
        if (file_exists($logoPath)) {
            $logoData = base64_encode(file_get_contents($logoPath));
        }

        $pdf = Pdf::loadView('pdf.student-score', [
            'score' => $score,
            'student' => $score->student,
            'studyClass' => $score->studyClass,
            'logoBase64' => $logoData,
        ]);

        $filename = "Progress_Report_" . str_replace(' ', '_', $score->student->name) . "_" . now()->format('Ymd') . ".pdf";

        return $pdf->download($filename);
    }
}
