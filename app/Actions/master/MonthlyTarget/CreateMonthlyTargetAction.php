<?php

namespace App\Actions\Master\MonthlyTarget;

use App\Models\MonthlyTarget;

class CreateMonthlyTargetAction
{
    public function execute(array $data): MonthlyTarget
    {
        return MonthlyTarget::create($data);
    }
}
