<?php

namespace App\Actions\PtExam\PtSession;

use App\Models\PtSession;

class UpdatePtSessionAction
{
    public function execute(PtSession $ptSession, array $data): PtSession
    {
        $ptSession->update($data);

        return $ptSession;
    }
}
