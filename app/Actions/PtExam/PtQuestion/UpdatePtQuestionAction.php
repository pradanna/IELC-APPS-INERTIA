<?php

namespace App\Actions\PtExam\PtQuestion;

use App\Models\PtQuestion;

class UpdatePtQuestionAction
{
    public function execute(PtQuestion $ptQuestion, array $data): PtQuestion
    {
        $ptQuestion->update($data);

        return $ptQuestion;
    }
}
