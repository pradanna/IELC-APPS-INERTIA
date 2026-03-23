<?php

namespace App\Actions\PtExam\PtQuestion;

use App\Models\PtQuestion;

class DeletePtQuestionAction
{
    public function execute(PtQuestion $ptQuestion): void
    {
        $ptQuestion->delete();
    }
}
