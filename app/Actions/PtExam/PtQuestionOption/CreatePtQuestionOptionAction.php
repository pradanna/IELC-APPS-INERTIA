<?php

namespace App\Actions\PtExam\PtQuestionOption;

use App\Models\PtQuestionOption;

class CreatePtQuestionOptionAction
{
    public function execute(array $data): PtQuestionOption
    {
        return PtQuestionOption::create($data);
    }
}
