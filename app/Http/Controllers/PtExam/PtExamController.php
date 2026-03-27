<?php

namespace App\Http\Controllers\PtExam;

use App\Actions\PtExam\CreatePtExamAction;
use App\Actions\PtExam\DeletePtExamAction;
use App\Actions\PtExam\UpdatePtExamAction;
use App\Actions\PtExam\GetActivePtExamsAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\PtExam\StorePtExamRequest;
use App\Http\Requests\PtExam\UpdatePtExamRequest;
use App\Http\Resources\PtExam\PtExamResource;
use App\Models\PtExam;
use App\Models\LeadStatus;
use App\Models\PtSession;
use Carbon\Carbon;
use Inertia\Inertia;

class PtExamController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        // Menghitung statistik cepat (Quick Stats)
        $stats = [
            'today' => PtSession::whereDate('created_at', $today)->count(),
            'inProgress' => PtSession::where('status', 'in_progress')->count(),
            'pending' => PtSession::where('status', 'pending')->count(),
        ];

        // Mengambil daftar anak yang sedang atau akan melakukan Placement Test
        $tests = PtSession::with(['lead.leadStatus', 'lead.interestPackage', 'ptExam'])->latest()->take(50)->get()->map(function ($session) {
            return [
                'id' => $session->id,
                'lead_id' => $session->lead_id,
                'lead_name' => $session->lead->name ?? 'Unknown',
                'wa' => $session->lead->phone ?? '-',
                'package_name' => $session->ptExam->title ?? 'Unknown',
                'package_slug' => $session->ptExam->slug ?? '',
                'scheduled_at' => $session->created_at->format('d M Y, H:i \W\I\B'),
                'status' => $session->status,
                'score' => $session->final_score,
                'recommended_level' => $session->recommended_level,
                'token' => $session->token,
                'lead_status' => $session->lead->leadStatus ? [
                    'id' => $session->lead->leadStatus->id,
                    'name' => $session->lead->leadStatus->name,
                    'bg_color' => $session->lead->leadStatus->bg_color,
                    'text_color' => $session->lead->leadStatus->text_color,
                ] : null,
            ];
        });

        // Mengambil daftar paket ujian yang tersedia
        $examPackages = PtExam::withCount('questions')->get()->map(function ($exam) {
            return [
                'id' => $exam->id,
                'name' => $exam->title,
                'questions_count' => $exam->questions_count,
                'active' => $exam->is_active,
            ];
        });

        $leadStatuses = LeadStatus::all();

        return Inertia::render('PlacementTests/Index', [
            'stats' => $stats,
            'tests' => $tests,
            'examPackages' => $examPackages,
            'leadStatuses' => $leadStatuses,
        ]);
    }

    public function store(StorePtExamRequest $request, CreatePtExamAction $action)
    {
        $action->execute($request->validated());

        return redirect()->route('admin.placement-tests.index')->with('success', 'Paket ujian berhasil dibuat.');
    }

    public function show(PtExam $ptExam)
    {
        $ptExam->loadCount('questions');

        // Memuat soal mandiri (tanpa grup) dan grup beserta soal-soalnya
        $ptExam->load([
            'questions' => function ($query) {
                $query->whereNull('pt_question_group_id')->with('options');
            },
            'ptQuestionGroups.questions.options'
        ]);

        return Inertia::render('PlacementTests/Show', [
            'exam' => new PtExamResource($ptExam)
        ]);
    }

    public function edit(PtExam $ptExam)
    {
        return Inertia::render('PlacementTests/Edit', [
            'exam' => new PtExamResource($ptExam)
        ]);
    }

    public function update(UpdatePtExamRequest $request, PtExam $ptExam, UpdatePtExamAction $action)
    {
        $action->execute($ptExam, $request->validated());

        return back()->with('success', 'Paket ujian berhasil diperbarui.');
    }

    public function destroy(PtExam $ptExam, DeletePtExamAction $action)
    {
        $action->execute($ptExam);

        return redirect()->route('admin.placement-tests.index')->with('success', 'Paket ujian berhasil dihapus.');
    }

    /**
     * Mengambil daftar paket ujian aktif (untuk dropdown Modal di frontend).
     */
    public function getActiveExams(GetActivePtExamsAction $action)
    {
        $exams = $action->execute();

        return response()->json($exams);
    }
}
