<?php

namespace App\Actions\PtExam;

use App\Models\PtExam;

class DeletePtExamAction
{
    public function execute(PtExam $ptExam): void
    {
        $ptExam->delete();
    }
}
