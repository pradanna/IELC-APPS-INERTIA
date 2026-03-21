<?php

namespace App\Actions\Master\MonthlyTarget;

use App\Models\MonthlyTarget;

class UpdateMonthlyTargetAction
{
    public function execute(MonthlyTarget $monthlyTarget, array $data): MonthlyTarget
    {
        $monthlyTarget->update($data);
        return $monthlyTarget;
    }
}
