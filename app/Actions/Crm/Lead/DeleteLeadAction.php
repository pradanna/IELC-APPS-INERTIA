<?php

namespace App\Actions\Crm\Lead;

use App\Models\Lead;

class DeleteLeadAction
{
    public function execute(Lead $lead): bool|null
    {
        return $lead->delete();
    }
}
