<?php

namespace App\Actions\PtExam;

use App\Models\PtExam;

class UpdatePtExamAction
{
    public function execute(PtExam $ptExam, array $data): PtExam
    {
        $ptExam->update($data);

        return $ptExam;
    }
}
