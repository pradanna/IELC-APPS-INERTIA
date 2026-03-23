<?php

namespace App\Actions\PtExam;

use App\Models\PtExam;

class CreatePtExamAction
{
    public function execute(array $data): PtExam
    {
        return PtExam::create($data);
    }
}
