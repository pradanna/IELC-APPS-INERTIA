<?php

namespace App\Actions\Master\LeadSource;

use App\Models\LeadSource;

class DeleteLeadSource
{
    public function execute(LeadSource $leadSource): ?bool
    {
        return $leadSource->delete();
    }
}
