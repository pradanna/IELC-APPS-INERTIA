<?php

namespace App\Actions\Master\LeadStatus;

use App\Models\LeadStatus;

class UpdateLeadStatus
{
    public function execute(LeadStatus $leadStatus, array $data): LeadStatus
    {
        $leadStatus->update($data);
        return $leadStatus;
    }
}
