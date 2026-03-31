<?php

namespace App\Actions\Master\Package;

use App\Models\Package;

class UpdatePackage
{
    public function execute(Package $package, array $data): Package
    {
        $package->update($data);

        return $package;
    }
}
