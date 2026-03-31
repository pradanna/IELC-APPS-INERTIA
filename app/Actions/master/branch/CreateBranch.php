<?php

namespace App\Actions\Master\Branch;

use App\Models\Branch;

class CreateBranch
{
    public function execute(array $data): Branch
    {
        return Branch::create($data);
    }
}
