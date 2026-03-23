<?php

namespace App\Actions\PtExam\PtAnswer;

use App\Models\PtAnswer;

class DeletePtAnswerAction
{
    public function execute(PtAnswer $ptAnswer): void
    {
        $ptAnswer->delete();
    }
}
