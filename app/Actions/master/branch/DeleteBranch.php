<?php

namespace App\Actions\Master\Branch;

use App\Models\Branch;

class DeleteBranch
{
    public function execute(Branch $branch): ?bool
    {
        return $branch->delete();
    }
}
