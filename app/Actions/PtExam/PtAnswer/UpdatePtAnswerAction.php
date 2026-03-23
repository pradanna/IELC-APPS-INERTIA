<?php

namespace App\Actions\PtExam\PtAnswer;

use App\Models\PtAnswer;

class UpdatePtAnswerAction
{
    public function execute(PtAnswer $ptAnswer, array $data): PtAnswer
    {
        $ptAnswer->update($data);

        return $ptAnswer;
    }
}
