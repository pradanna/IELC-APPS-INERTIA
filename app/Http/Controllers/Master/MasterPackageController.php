<?php

namespace App\Http\Controllers\Master;

use App\Actions\Master\Package\CreatePackage;
use App\Actions\Master\Package\DeletePackage;
use App\Actions\Master\Package\UpdatePackage;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\Package\StorePackageRequest;
use App\Http\Requests\Master\Package\UpdatePackageRequest;
use App\Models\Package;

class MasterPackageController extends Controller
{
    public function store(StorePackageRequest $request, CreatePackage $createPackage)
    {
        $createPackage->execute($request->validated());

        return redirect()->back()->with('success', 'Package created successfully.');
    }

    public function update(UpdatePackageRequest $request, Package $package, UpdatePackage $updatePackage)
    {
        $updatePackage->execute($package, $request->validated());

        return redirect()->back()->with('success', 'Package updated successfully.');
    }

    public function destroy(Package $package, DeletePackage $deletePackage)
    {
        $deletePackage->execute($package);

        return redirect()->back()->with('success', 'Package deleted successfully.');
    }
}
