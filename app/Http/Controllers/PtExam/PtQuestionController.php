<?php

namespace App\Http\Controllers\PtExam;

use App\Http\Controllers\Controller;
use App\Http\Requests\PtExam\PtQuestion\StorePtQuestionRequest;
use App\Http\Requests\PtExam\PtQuestion\UpdatePtQuestionRequest;
use App\Actions\PtExam\PtQuestion\DeletePtQuestionAction;
use App\Actions\PtExam\PtQuestion\UpdatePtQuestionAction;
use App\Models\PtExam;
use App\Models\PtQuestion;
use App\Exports\PtQuestionsTemplateExport;
use App\Imports\PtQuestionsImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PtQuestionController extends Controller
{
    public function store(StorePtQuestionRequest $request, PtExam $ptExam)
    {
        $validated = $request->validated();

        // Handle unggahan file media jika ada
        $mediaPath = null;
        if ($request->hasFile('media')) {
            $file = $request->file('media');
            $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/pt-questions-media'), $filename);
            $mediaPath = 'uploads/pt-questions-media/' . $filename;
        }

        // Simpan data soal utama
        $question = $ptExam->questions()->create([
            'pt_question_group_id' => $validated['pt_question_group_id'] ?? null,
            'question_text' => $validated['question_text'],
            'points' => $validated['points'],
            'audio_path' => $mediaPath,
        ]);

        // Asumsi jika menggunakan tabel relasi terpisah untuk opsi (HasMany `options`)
        foreach ($validated['options'] as $index => $optionText) {
            $question->options()->create([
                'option_text' => $optionText,
                'is_correct' => ($index == $validated['correct_answer']),
            ]);
        }

        return back()->with('success', 'Soal berhasil ditambahkan.');
    }

    public function import(Request $request, PtExam $ptExam)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:5120',
        ]);

        Excel::import(new PtQuestionsImport($ptExam), $request->file('file'));

        return back()->with('success', 'Soal berhasil diimpor dari Excel.');
    }

    public function downloadTemplate()
    {
        return Excel::download(new PtQuestionsTemplateExport, 'Template_Import_Soal.xlsx');
    }

    public function update(UpdatePtQuestionRequest $request, PtExam $ptExam, PtQuestion $question, UpdatePtQuestionAction $action)
    {
        $action->execute($question, $request->validated(), $request->file('media'));

        return back()->with('success', 'Soal berhasil diperbarui.');
    }

    public function destroy(PtExam $ptExam, PtQuestion $question, DeletePtQuestionAction $action)
    {
        $action->execute($question);

        return back()->with('success', 'Soal berhasil dihapus.');
    }
}
