<?php

namespace App\Http\Controllers\PtExam;

use App\Actions\PtExam\PtAnswer\CreatePtAnswerAction;
use App\Actions\PtExam\PtAnswer\DeletePtAnswerAction;
use App\Actions\PtExam\PtAnswer\UpdatePtAnswerAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\PtExam\PtAnswer\StorePtAnswerRequest;
use App\Http\Requests\PtExam\PtAnswer\UpdatePtAnswerRequest;
use App\Http\Resources\PtExam\PtAnswer\PtAnswerResource;
use App\Http\Resources\PtExam\PtQuestion\PtQuestionResource;
use App\Http\Resources\PtExam\PtSession\PtSessionResource;
use App\Models\PtAnswer;
use App\Models\PtQuestion;
use App\Models\PtSession;
use Inertia\Inertia;

class PtAnswerController extends Controller
{
    public function index()
    {
        $answers = PtAnswer::with(['ptSession', 'ptQuestion'])->latest()->get();

        return Inertia::render('PtAnswers/Index', [
            'answers' => PtAnswerResource::collection($answers)
        ]);
    }

    public function create()
    {
        $sessions = PtSession::all();
        $questions = PtQuestion::all();

        return Inertia::render('PtAnswers/Create', [
            'sessions' => PtSessionResource::collection($sessions),
            'questions' => PtQuestionResource::collection($questions),
        ]);
    }

    public function store(StorePtAnswerRequest $request, CreatePtAnswerAction $action)
    {
        $action->execute($request->validated());

        return redirect()->route('pt-answers.index')->with('success', 'Answer recorded successfully.');
    }

    public function edit(PtAnswer $ptAnswer)
    {
        // Setup the inertia view for edit form if needed
    }

    public function update(UpdatePtAnswerRequest $request, PtAnswer $ptAnswer, UpdatePtAnswerAction $action)
    {
        $action->execute($ptAnswer, $request->validated());

        return redirect()->route('pt-answers.index')->with('success', 'Answer updated successfully.');
    }

    public function destroy(PtAnswer $ptAnswer, DeletePtAnswerAction $action)
    {
        $action->execute($ptAnswer);

        return redirect()->route('pt-answers.index')->with('success', 'Answer deleted successfully.');
    }
}
