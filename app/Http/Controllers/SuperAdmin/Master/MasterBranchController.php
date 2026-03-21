<?php

namespace App\Http\Controllers\SuperAdmin\Master;

use App\Actions\Master\Branch\CreateBranch;
use App\Actions\Master\Branch\DeleteBranch;
use App\Actions\Master\Branch\UpdateBranch;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\Branch\StoreBranchRequest;
use App\Http\Requests\Master\Branch\UpdateBranchRequest;
use App\Models\Branch;

class MasterBranchController extends Controller
{
    public function store(StoreBranchRequest $request, CreateBranch $createBranch)
    {
        $createBranch->execute($request->validated());

        return redirect()->back()->with('success', 'Branch created successfully.');
    }

    public function update(UpdateBranchRequest $request, Branch $branch, UpdateBranch $updateBranch)
    {
        $updateBranch->execute($branch, $request->validated());

        return redirect()->back()->with('success', 'Branch updated successfully.');
    }

    public function destroy(Branch $branch, DeleteBranch $deleteBranch)
    {
        $deleteBranch->execute($branch);

        return redirect()->back()->with('success', 'Branch deleted successfully.');
    }
}
