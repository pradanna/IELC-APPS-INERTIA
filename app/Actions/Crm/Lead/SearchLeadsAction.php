<?php

namespace App\Actions\Crm\Lead;

use App\Models\Lead;
use App\Models\User;

class SearchLeadsAction
{
    public function execute(string $searchTerm, User $user)
    {
        $query = Lead::query()
            ->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('phone', 'like', "%{$searchTerm}%");
            })
            ->select(['id', 'name', 'phone']); // Hanya pilih kolom yang dibutuhkan

        // Terapkan isolasi data per cabang untuk frontdesk
        if ($user->role === 'frontdesk' && $user->frontdesk) {
            $query->where('branch_id', $user->frontdesk->branch_id);
        }

        return $query->latest()->take(7)->get(); // Batasi hasil untuk dropdown
    }
}
