<?php

namespace App\Actions\Crm\Lead;

use App\Models\Lead;
use Illuminate\Support\Facades\DB;
use App\Actions\Crm\Lead\UpdateLeadStatus;

class StoreLeadFollowupAction
{
    public function __construct(protected UpdateLeadStatus $updateLeadStatusAction) {}

    public function execute(Lead $lead, array $data, int $userId): void
    {
        // Menggunakan DB facade agar langsung mengarah ke tabel migration
        // Tanpa harus wajib mendeklarasikan App\Models\LeadFollowup jika Anda belum membuatnya
        DB::table('lead_followups')->insert([
            'lead_id' => $lead->id,
            'method' => $data['method'],
            'scheduled_at' => $data['scheduled_at'],
            'notes' => $data['notes'] ?? null,
            'user_id' => $userId,
            'status' => 'pending', // Default sesuai skema database
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Jika status diubah melalui modal followup, update juga status lead-nya
        if (isset($data['lead_status_id']) && $lead->lead_status_id != $data['lead_status_id']) {
            $this->updateLeadStatusAction->execute($lead, $data['lead_status_id']);
        }
    }
}
