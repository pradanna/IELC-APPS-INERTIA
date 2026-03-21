<?php

namespace App\Actions\Master\Branch;

use App\Models\Branch;

class UpdateBranch
{
    public function execute(Branch $branch, array $data): Branch
    {
        $branch->update($data);

        return $branch;
    }
}
