<?php

namespace App\Http\Controllers\PtExam;

use App\Actions\PtExam\PtQuestionOption\CreatePtQuestionOptionAction;
use App\Actions\PtExam\PtQuestionOption\DeletePtQuestionOptionAction;
use App\Actions\PtExam\PtQuestionOption\UpdatePtQuestionOptionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\PtExam\PtQuestionOption\UpdatePtQuestionOptionRequest;
use App\Http\Requests\PtQuestionOption\StorePtQuestionOptionRequest;
use App\Http\Resources\PtQuestion\PtQuestionResource;
use App\Http\Resources\PtQuestionOption\PtQuestionOptionResource;
use App\Models\PtQuestion;
use App\Models\PtQuestionOption;
use Inertia\Inertia;

class PtQuestionOptionController extends Controller
{
    public function index()
    {
        $options = PtQuestionOption::with('ptQuestion')->latest()->get();

        return Inertia::render('PtQuestionOptions/Index', [
            'options' => PtQuestionOptionResource::collection($options)
        ]);
    }

    public function create()
    {
        $questions = PtQuestion::all();

        return Inertia::render('PtQuestionOptions/Create', [
            'questions' => PtQuestionResource::collection($questions)
        ]);
    }

    public function store(StorePtQuestionOptionRequest $request, CreatePtQuestionOptionAction $action)
    {
        $action->execute($request->validated());

        return redirect()->route('pt-question-options.index')->with('success', 'Option created successfully.');
    }

    public function edit(PtQuestionOption $ptQuestionOption)
    {
        $questions = PtQuestion::all();

        return Inertia::render('PtQuestionOptions/Edit', [
            'option' => new PtQuestionOptionResource($ptQuestionOption),
            'questions' => PtQuestionResource::collection($questions)
        ]);
    }

    public function update(UpdatePtQuestionOptionRequest $request, PtQuestionOption $ptQuestionOption, UpdatePtQuestionOptionAction $action)
    {
        $action->execute($ptQuestionOption, $request->validated());

        return redirect()->route('pt-question-options.index')->with('success', 'Option updated successfully.');
    }

    public function destroy(PtQuestionOption $ptQuestionOption, DeletePtQuestionOptionAction $action)
    {
        $action->execute($ptQuestionOption);

        return redirect()->route('pt-question-options.index')->with('success', 'Option deleted successfully.');
    }
}
