<?php

namespace App\Actions\Crm\Lead;

use App\Models\Lead;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Str;

class UpdateLeadStatus
{
    /**
     * Updates the status of a given lead.
     *
     * @param Lead $lead The lead to update.
     * @param string $statusId The new status ID.
     * @return Lead The updated lead instance.
     */
    public function execute(Lead $lead, string $statusId): Lead
    {
        // Tangkap status lama
        $oldStatusId = $lead->lead_status_id;

        $lead->lead_status_id = $statusId;

        // Deteksi apakah status baru adalah "Joined" berdasarkan nama, bukan hardcoded UUID
        $status = \App\Models\LeadStatus::find($statusId);
        if ($status && strtolower($status->name) === 'joined' && is_null($lead->joined_at)) {
            $lead->joined_at = now();
        }

        // Tangkap dan simpan pilihan paket (biasanya dari modal PT Schedule / update inline)
        $interestPackageId = request('interest_package_id');
        if (!empty($interestPackageId)) {
            $lead->interest_package_id = $interestPackageId;
        }

        $lead->save();

        // Tangkap eksekusi jika status Placement Test (UUID c0a80101-0000-0000-0000-000000000004) dilakukan dari update inline
        if ($statusId === 'c0a80101-0000-0000-0000-000000000004') {
            $ptExamId = request('pt_exam_id');
            if (!empty($ptExamId)) {
                $rawDate = request('scheduled_at');
                $scheduledAt = $rawDate ? Carbon::parse($rawDate)->format('Y-m-d H:i:s') : now();

                \App\Models\PtSession::create([
                    'lead_id' => $lead->id,
                    'pt_exam_id' => $ptExamId,
                    'status' => 'pending',
                    'token' => Str::random(32),
                    'created_at' => $scheduledAt,
                    'updated_at' => now(),
                ]);
            }
        }

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
