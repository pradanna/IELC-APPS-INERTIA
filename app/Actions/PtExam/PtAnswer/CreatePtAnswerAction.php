<?php

namespace App\Actions\PtExam\PtAnswer;

use App\Models\PtAnswer;

class CreatePtAnswerAction
{
    public function execute(array $data): PtAnswer
    {
        return PtAnswer::create($data);
    }
}
