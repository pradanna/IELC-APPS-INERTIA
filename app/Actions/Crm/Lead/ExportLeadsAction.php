<?php

namespace App\Actions\Crm\Lead;

use App\Models\Lead;
use Illuminate\Support\Collection;

class ExportLeadsAction
{
    public function execute($user, ?string $search = null)
    {
        $query = Lead::query();

        // Multi-branch Isolation (Sama seperti di method index)
        if ($user->role === 'frontdesk' && $user->frontdesk) {
            $query->where('branch_id', $user->frontdesk->branch_id);
        }

        // Filter by search query jika ada
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $leads = $query->with(['branch', 'leadSource', 'interestLevel', 'interestPackage'])->latest()->get();

        return function () use ($leads) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Tanggal Dibuat', 'Cabang', 'Nama Calon Siswa', 'No. HP', 'Email', 'Sumber (Source)', 'Status', 'Minat Level', 'Minat Paket', 'Catatan']);

            foreach ($leads as $lead) {
                fputcsv($file, [
                    $lead->created_at->format('Y-m-d H:i'),
                    $lead->branch->name ?? '-',
                    $lead->name,
                    $lead->phone,
                    $lead->email ?? '-',
                    $lead->leadSource->name ?? '-',
                    $lead->status ?? 'new',
                    $lead->interestLevel->name ?? '-',
                    $lead->interestPackage->name ?? '-',
                    $lead->notes ?? '-'
                ]);
            }
            fclose($file);
        };
    }
}
