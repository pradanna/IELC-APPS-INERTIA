<?php

namespace App\Actions\Master\MonthlyTarget;

use App\Models\MonthlyTarget;

class DeleteMonthlyTargetAction
{
    public function execute(MonthlyTarget $monthlyTarget): bool
    {
        return $monthlyTarget->delete();
    }
}
