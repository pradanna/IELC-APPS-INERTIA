<?php

namespace App\Http\Controllers\PtExam;

use App\Actions\PtExam\CreatePtExamAction;
use App\Actions\PtExam\DeletePtExamAction;
use App\Actions\PtExam\UpdatePtExamAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\PtExam\StorePtExamRequest;
use App\Http\Requests\PtExam\UpdatePtExamRequest;
use App\Http\Resources\PtExam\PtExamResource;
use App\Models\PtExam;
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
        $tests = PtSession::with(['lead', 'ptExam'])->latest()->take(50)->get()->map(function ($session) {
            return [
                'id' => $session->id,
                'lead_name' => $session->lead->name ?? 'Unknown',
                'wa' => $session->lead->phone ?? '-',
                'package_name' => $session->ptExam->title ?? 'Unknown',
                'scheduled_at' => $session->created_at->format('d M Y, H:i \W\I\B'),
                'status' => $session->status,
                'score' => $session->final_score,
                'recommended_level' => $session->recommended_level,
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

        return Inertia::render('PlacementTests/Index', [
            'stats' => $stats,
            'tests' => $tests,
            'examPackages' => $examPackages,
        ]);
    }

    public function create()
    {
        return Inertia::render('PlacementTests/Create');
    }

    public function store(StorePtExamRequest $request, CreatePtExamAction $action)
    {
        $action->execute($request->validated());

        return redirect()->route('superadmin.placement-tests.index')->with('success', 'Paket ujian berhasil dibuat.');
    }

    public function show(PtExam $ptExam)
    {
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

        return redirect()->route('superadmin.placement-tests.index')->with('success', 'Paket ujian berhasil diperbarui.');
    }

    public function destroy(PtExam $ptExam, DeletePtExamAction $action)
    {
        $action->execute($ptExam);

        return redirect()->route('superadmin.placement-tests.index')->with('success', 'Paket ujian berhasil dihapus.');
    }
}
