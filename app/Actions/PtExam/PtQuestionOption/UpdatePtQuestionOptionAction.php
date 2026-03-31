<?php

namespace App\Actions\PtExam\PtQuestionOption;

use App\Models\PtQuestionOption;

class UpdatePtQuestionOptionAction
{
    public function execute(PtQuestionOption $ptQuestionOption, array $data): PtQuestionOption
    {
        $ptQuestionOption->update($data);

        return $ptQuestionOption;
    }
}
