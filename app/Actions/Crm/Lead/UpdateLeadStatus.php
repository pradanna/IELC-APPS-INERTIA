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
     * @param int $statusId The new status ID.
     * @return Lead The updated lead instance.
     */
    public function execute(Lead $lead, int $statusId): Lead
    {
        // Tangkap status lama
        $oldStatusId = $lead->lead_status_id;

        $lead->lead_status_id = $statusId;

        // Asumsi ID 5 adalah status 'Joined' / 'Enrolled' (sesuai dengan LeadController index)
        if ($statusId == 5 && is_null($lead->joined_at)) {
            $lead->joined_at = now();
        }

        $lead->save();

        // Opsional: Paksa tulis log secara manual HANYA jika otomatisnya benar-benar gagal
        /*
        activity()
            ->performedOn($lead)
            ->causedBy(auth()->user())
            ->withProperties(['attributes' => ['lead_status_id' => $statusId], 'old' => ['lead_status_id' => $oldStatusId]])
            ->log('updated');
        */

        Log::info("Updated status for lead #{$lead->id} to '{$statusId}'.");

        return $lead->fresh();
    }
}
