<?php

namespace App\Http\Controllers\Master;

use App\Actions\Master\LeadSource\CreateLeadSource;
use App\Actions\Master\LeadSource\DeleteLeadSource;
use App\Actions\Master\LeadSource\UpdateLeadSource;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\LeadSource\StoreLeadSourceRequest;
use App\Http\Requests\Master\LeadSource\UpdateLeadSourceRequest;
use App\Models\LeadSource;

class MasterLeadSourceController extends Controller
{
    public function store(StoreLeadSourceRequest $request, CreateLeadSource $createLeadSource)
    {
        $createLeadSource->execute($request->validated());

        return redirect()->back()->with('success', 'Lead Source created successfully.');
    }

    public function update(UpdateLeadSourceRequest $request, LeadSource $leadSource, UpdateLeadSource $updateLeadSource)
    {
        $updateLeadSource->execute($leadSource, $request->validated());

        return redirect()->back()->with('success', 'Lead Source updated successfully.');
    }

    public function destroy(LeadSource $leadSource, DeleteLeadSource $deleteLeadSource)
    {
        $deleteLeadSource->execute($leadSource);

        return redirect()->back()->with('success', 'Lead Source deleted successfully.');
    }
}
