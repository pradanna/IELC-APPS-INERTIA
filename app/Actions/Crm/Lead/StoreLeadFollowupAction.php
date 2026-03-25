<?php

namespace App\Actions\Crm\Lead;

use App\Models\Lead;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Actions\Crm\Lead\UpdateLeadStatus;

class StoreLeadFollowupAction
{
    public function __construct(protected UpdateLeadStatus $updateLeadStatusAction) {}

    public function execute(Lead $lead, array $data, int $userId): void
    {
        DB::transaction(function () use ($lead, $data, $userId) {
            // Menggunakan DB facade agar langsung mengarah ke tabel migration
            // Tanpa harus wajib mendeklarasikan App\Models\LeadFollowup jika Anda belum membuatnya
            $rawDate = $data['scheduled_at'] ?? request('scheduled_at');
            $scheduledAt = $rawDate ? Carbon::parse($rawDate)->format('Y-m-d H:i:s') : now();

            DB::table('lead_followups')->insert([
                'lead_id' => $lead->id,
                'method' => $data['method'],
                'scheduled_at' => $scheduledAt,
                'notes' => $data['notes'] ?? null,
                'user_id' => $userId,
                'status' => 'pending', // Default sesuai skema database
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Jika status diubah melalui modal followup, update juga status lead-nya
            $leadStatusId = $data['lead_status_id'] ?? request('lead_status_id');
            if ($leadStatusId && $lead->lead_status_id != $leadStatusId) {
                $this->updateLeadStatusAction->execute($lead, $leadStatusId);
            }

            // Jika interest package dipilih/diubah dari modal (misal saat Waiting for Payment), update di tabel lead
            $interestPackageId = $data['interest_package_id'] ?? request('interest_package_id');
            if ($interestPackageId) {
                $lead->update(['interest_package_id' => $interestPackageId]);
            }

            // Jika status Placement Test (ID 4) dipilih, masukkan ke tabel pt_sessions
            $ptExamId = $data['pt_exam_id'] ?? request('pt_exam_id');
            if ($leadStatusId && (int)$leadStatusId === 4 && !empty($ptExamId)) {

                // Mencegah duplikasi data: cek apakah pt_session yang sama sudah digenerate (misal oleh aksi UpdateLeadStatus)
                $sessionExists = DB::table('pt_sessions')
                    ->where('lead_id', $lead->id)
                    ->where('status', 'pending')
                    ->exists();

                if (!$sessionExists) {
                    DB::table('pt_sessions')->insert([
                        'lead_id' => $lead->id,
                        'pt_exam_id' => $ptExamId,
                        'status' => 'pending',
                        'token' => Str::random(32),
                        'created_at' => $scheduledAt,
                        'updated_at' => now(),
                    ]);
                }
            }
        });
    }
}
