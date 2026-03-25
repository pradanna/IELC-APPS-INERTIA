<?php

namespace App\Actions\PtExam\PtQuestion;

use App\Models\PtQuestion;

class DeletePtQuestionAction
{
    public function execute(PtQuestion $ptQuestion): void
    {
        // Hapus file media fisik jika ada
        if ($ptQuestion->audio_path && file_exists(public_path($ptQuestion->audio_path))) {
            unlink(public_path($ptQuestion->audio_path));
        }

        $ptQuestion->delete();
    }
}
