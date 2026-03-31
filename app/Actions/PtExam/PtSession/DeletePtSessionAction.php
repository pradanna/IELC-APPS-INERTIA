<?php

namespace App\Actions\PtExam\PtSession;

use App\Models\PtSession;

class DeletePtSessionAction
{
    public function execute(PtSession $ptSession): void
    {
        $ptSession->delete();
    }
}
