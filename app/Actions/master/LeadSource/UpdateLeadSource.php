<?php

namespace App\Actions\Master\LeadSource;

use App\Models\LeadSource;

class UpdateLeadSource
{
    public function execute(LeadSource $leadSource, array $data): LeadSource
    {
        $leadSource->update($data);

        return $leadSource;
    }
}
