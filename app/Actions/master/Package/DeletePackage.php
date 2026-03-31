<?php

namespace App\Actions\Master\Package;

use App\Models\Package;

class DeletePackage
{
    public function execute(Package $package): ?bool
    {
        return $package->delete();
    }
}
