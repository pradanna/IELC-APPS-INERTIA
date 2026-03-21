<?php

namespace App\Actions\Master\Level;

use App\Models\Level;

class UpdateLevel
{
    public function execute(Level $level, array $data): Level
    {
        $level->update($data);

        return $level;
    }
}
