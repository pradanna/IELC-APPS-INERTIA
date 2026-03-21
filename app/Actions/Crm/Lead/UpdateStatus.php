<?php

namespace App\Actions\Crm\Lead;

use App\Models\Lead;
use Illuminate\Support\Facades\Log;

class UpdateLeadStatus
{
    /**
     * Updates the status of a given lead.
     *
     * @param Lead $lead The lead to update.
     * @param string $status The new status.
     * @return Lead The updated lead instance.
     */
    public function execute(Lead $lead, string $status): Lead
    {
        // Here you could also add logic to create a history entry for the status change.
        // For example: $lead->histories()->create([...]);

        $lead->status = $status;
        $lead->save();

        Log::info("Updated status for lead #{$lead->id} to '{$status}'.");

        return $lead->fresh();
    }
}
