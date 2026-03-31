<?php

namespace App\Http\Controllers\PtExam;

use App\Actions\PtExam\PtSession\CreatePtSessionAction;
use App\Actions\PtExam\PtSession\DeletePtSessionAction;
use App\Actions\PtExam\PtSession\UpdatePtSessionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\PtExam\PtSession\StorePtSessionRequest;
use App\Http\Requests\PtExam\PtSession\UpdatePtSessionRequest;
use App\Http\Resources\PtExam\PtExamResource;
use App\Http\Resources\PtExam\PtSession\PtSessionResource;
use App\Models\Lead;
use App\Models\PtExam;
use App\Models\PtSession;
use Inertia\Inertia;

class PtSessionController extends Controller
{
    public function index()
    {
        $sessions = PtSession::with(['lead', 'ptExam'])->latest()->get();

        return Inertia::render('PtSessions/Index', [
            'sessions' => PtSessionResource::collection($sessions)
        ]);
    }

    public function create()
    {
        $leads = Lead::latest()->get(); // Sebaiknya gunakan resource khusus untuk dropdown jika data sangat besar
        $exams = PtExam::where('is_active', true)->get();

        return Inertia::render('PtSessions/Create', [
            'leads' => $leads,
            'exams' => PtExamResource::collection($exams)
        ]);
    }

    public function store(StorePtSessionRequest $request, CreatePtSessionAction $action)
    {
        $action->execute($request->validated());

        return redirect()->route('pt-sessions.index')->with('success', 'Placement test session generated successfully.');
    }

    public function edit(PtSession $ptSession)
    {
        return Inertia::render('PtSessions/Edit', [
            'session' => new PtSessionResource($ptSession->load(['lead', 'ptExam']))
        ]);
    }

    public function update(UpdatePtSessionRequest $request, PtSession $ptSession, UpdatePtSessionAction $action)
    {
        $action->execute($ptSession, $request->validated());

        return redirect()->route('pt-sessions.index')->with('success', 'Session updated successfully.');
    }

    public function destroy(PtSession $ptSession, DeletePtSessionAction $action)
    {
        $action->execute($ptSession);

        return redirect()->route('pt-sessions.index')->with('success', 'Session deleted successfully.');
    }
}
