<?php

namespace App\Http\Controllers\PtExam;

use App\Actions\PtExam\PtQuestion\CreatePtQuestionAction;
use App\Actions\PtQuestion\DeletePtQuestionAction;
use App\Actions\PtQuestion\UpdatePtQuestionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\PtExam\PtQuestion\StorePtQuestionRequest;
use App\Http\Requests\PtExam\PtQuestion\UpdatePtQuestionRequest;
use App\Http\Resources\PtExam\PtExamResource;
use App\Http\Resources\PtQuestion\PtQuestionResource;
use App\Models\PtExam;
use App\Models\PtQuestion;
use Inertia\Inertia;

class PtQuestionController extends Controller
{
    public function index()
    {
        $questions = PtQuestion::with('ptExam')->latest()->get();

        return Inertia::render('PtQuestions/Index', [
            'questions' => PtQuestionResource::collection($questions)
        ]);
    }

    public function create()
    {
        $exams = PtExam::where('is_active', true)->get();

        return Inertia::render('PtQuestions/Create', [
            'exams' => PtExamResource::collection($exams)
        ]);
    }

    public function store(StorePtQuestionRequest $request, CreatePtQuestionAction $action)
    {
        $action->execute($request->validated());

        return redirect()->route('pt-questions.index')->with('success', 'Question created successfully.');
    }

    public function edit(PtQuestion $ptQuestion)
    {
        $exams = PtExam::where('is_active', true)->get();

        return Inertia::render('PtQuestions/Edit', [
            'question' => new PtQuestionResource($ptQuestion),
            'exams' => PtExamResource::collection($exams)
        ]);
    }

    public function update(UpdatePtQuestionRequest $request, PtQuestion $ptQuestion, UpdatePtQuestionAction $action)
    {
        $action->execute($ptQuestion, $request->validated());

        return redirect()->route('pt-questions.index')->with('success', 'Question updated successfully.');
    }

    public function destroy(PtQuestion $ptQuestion, DeletePtQuestionAction $action)
    {
        $action->execute($ptQuestion);

        return redirect()->route('pt-questions.index')->with('success', 'Question deleted successfully.');
    }
}
