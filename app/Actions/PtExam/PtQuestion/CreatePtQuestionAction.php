<?php

namespace App\Actions\PtExam\PtQuestion;

use App\Models\PtQuestion;

class CreatePtQuestionAction
{
    public function execute(array $data): PtQuestion
    {
        return PtQuestion::create($data);
    }
}
