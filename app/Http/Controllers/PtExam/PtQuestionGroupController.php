<?php

namespace App\Http\Controllers\PtExam;

use App\Http\Controllers\Controller;
use App\Actions\PtExam\PtQuestionGroup\CreatePtQuestionGroupAction;
use App\Actions\PtExam\PtQuestionGroup\UpdatePtQuestionGroupAction;
use App\Actions\PtExam\PtQuestionGroup\DeletePtQuestionGroupAction;
use App\Http\Requests\PtExam\PtQuestionGroup\StorePtQuestionGroupRequest;
use App\Models\PtExam;
use App\Models\PtQuestionGroup;
use Illuminate\Http\Request;

class PtQuestionGroupController extends Controller
{
    public function store(StorePtQuestionGroupRequest $request, PtExam $ptExam, CreatePtQuestionGroupAction $action)
    {
        $action->execute(
            $ptExam,
            $request->validated(),
            $request->file('audio_path')
        );

        return back()->with('success', 'Grup Soal berhasil ditambahkan.');
    }

    public function update(Request $request, PtExam $ptExam, PtQuestionGroup $ptQuestionGroup, UpdatePtQuestionGroupAction $action)
    {
        $validated = $request->validate([
            'instruction' => 'required|string|max:255',
            'reading_text' => 'nullable|string',
            'audio_path' => 'nullable|file|mimes:mp3,wav,ogg|max:10240',
        ]);

        $action->execute($ptQuestionGroup, $validated, $request->file('audio_path'));

        return back()->with('success', 'Grup Soal berhasil diperbarui.');
    }

    public function destroy(PtExam $ptExam, PtQuestionGroup $ptQuestionGroup, DeletePtQuestionGroupAction $action)
    {
        $action->execute($ptQuestionGroup);

        return back()->with('success', 'Grup Soal beserta seluruh soal di dalamnya berhasil dihapus.');
    }
}
