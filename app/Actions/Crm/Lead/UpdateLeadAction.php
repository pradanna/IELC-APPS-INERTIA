<?php

namespace App\Actions\Crm\Lead;

use App\Models\Lead;

class UpdateLeadAction
{
    public function execute(Lead $lead, array $data): Lead
    {
        // Detect if status is changing to 'Joined' during update
        if (isset($data['lead_status_id']) && $data['lead_status_id'] !== $lead->lead_status_id) {
            $status = \App\Models\LeadStatus::find($data['lead_status_id']);
            if ($status && strtolower($status->name) === 'joined' && is_null($lead->joined_at)) {
                $data['joined_at'] = now();
            }
        }

        $lead->update($data);

        return $lead;
    }
}
