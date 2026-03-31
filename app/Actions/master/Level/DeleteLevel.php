<?php

namespace App\Actions\Master\Level;

use App\Models\Level;

class DeleteLevel
{
    public function execute(Level $level): ?bool
    {
        return $level->delete();
    }
}
