<?php

namespace App\Actions\Crm\Lead;

use App\Models\Lead;

class StoreLeadAction
{
    public function execute(array $data): Lead
    {
        // The lead_status_id is set to default 1 ('New') in migration
        return Lead::create($data);
    }
}
