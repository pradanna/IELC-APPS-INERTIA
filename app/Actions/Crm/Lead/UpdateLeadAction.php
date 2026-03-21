<?php

namespace App\Actions\Crm\Lead;

use App\Models\Lead;

class UpdateLeadAction
{
    public function execute(Lead $lead, array $data): Lead
    {
        $lead->update($data);

        return $lead;
    }
}
