<?php

namespace App\Actions\Master\LeadStatus;

use App\Models\LeadStatus;

class DeleteLeadStatus
{
    public function execute(LeadStatus $leadStatus): void
    {
        $leadStatus->delete();
    }
}
