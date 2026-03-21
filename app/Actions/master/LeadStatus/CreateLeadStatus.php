<?php

namespace App\Actions\Master\LeadStatus;

use App\Models\LeadStatus;

class CreateLeadStatus
{
    public function execute(array $data): LeadStatus
    {
        return LeadStatus::create($data);
    }
}
