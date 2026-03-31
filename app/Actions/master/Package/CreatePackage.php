<?php

namespace App\Actions\Master\Package;

use App\Models\Package;

class CreatePackage
{
    public function execute(array $data): Package
    {
        return Package::create($data);
    }
}
