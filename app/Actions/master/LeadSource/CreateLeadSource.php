<?php

namespace App\Actions\Master\LeadSource;

use App\Models\LeadSource;

class CreateLeadSource
{
    public function execute(array $data): LeadSource
    {
        return LeadSource::create($data);
    }
}
