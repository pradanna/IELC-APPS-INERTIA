<?php

namespace App\Actions\Master\Level;

use App\Models\Level;

class CreateLevel
{
    public function execute(array $data): Level
    {
        return Level::create($data);
    }
}
