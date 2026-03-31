<?php

namespace App\Actions\Crm\Lead;

use App\Models\Lead;
use Illuminate\Support\Collection;

class ExportLeadsAction
{
    public function execute($user, array $filters = [])
    {
        $query = Lead::query();

        // Multi-branch Isolation (Frontdesk only sees their branch leads)
        if ($user->role === 'frontdesk' && $user->frontdesk) {
            $query->where('branch_id', $user->frontdesk->branch_id);
        } else if (isset($filters['branch_id']) && $filters['branch_id'] !== 'all') {
            $query->where('branch_id', $filters['branch_id']);
        }

        // Filter by Month & Year
        if (isset($filters['month']) && isset($filters['year'])) {
            $query->whereMonth('created_at', $filters['month'])->whereYear('created_at', $filters['year']);
        }

        // Filter by Lead Source
        if (isset($filters['lead_source_id']) && $filters['lead_source_id'] !== 'all') {
            $query->where('lead_source_id', $filters['lead_source_id']);
        }

        // Filter by search query jika ada
        if (isset($filters['search']) && !empty($filters['search'])) {
            $search = $filters['search'];
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
