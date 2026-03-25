<?php

namespace App\Actions\PtExam\PtQuestionGroup;

use App\Models\PtQuestionGroup;
use App\Actions\PtExam\PtQuestion\DeletePtQuestionAction;

class DeletePtQuestionGroupAction
{
    public function execute(PtQuestionGroup $ptQuestionGroup): void
    {
        $deleteQuestionAction = new DeletePtQuestionAction();

        // Hapus satu per satu soal di dalam grup ini agar file medianya ikut terhapus
        foreach ($ptQuestionGroup->questions as $question) {
            $deleteQuestionAction->execute($question);
        }

        // Hapus file media instruksi grup
        if ($ptQuestionGroup->audio_path && file_exists(public_path($ptQuestionGroup->audio_path))) {
            unlink(public_path($ptQuestionGroup->audio_path));
        }

        $ptQuestionGroup->delete();
    }
}
