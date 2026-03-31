<?php

namespace App\Actions\PtExam\PtQuestionOption;

use App\Models\PtQuestionOption;

class DeletePtQuestionOptionAction
{
    public function execute(PtQuestionOption $ptQuestionOption): void
    {
        $ptQuestionOption->delete();
    }
}
