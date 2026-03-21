<?php

namespace App\Http\Controllers\SuperAdmin\Master;

use App\Actions\Master\LeadStatus\CreateLeadStatus;
use App\Actions\Master\LeadStatus\DeleteLeadStatus;
use App\Actions\Master\LeadStatus\UpdateLeadStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\LeadStatus\StoreLeadStatusRequest;
use App\Http\Requests\Master\LeadStatus\UpdateLeadStatusRequest;
use App\Http\Resources\LeadStatusResource;
use App\Models\LeadStatus;
use Inertia\Inertia;

class LeadStatusController extends Controller
{
    public function index()
    {
        // return Inertia::render('SuperAdmin/Master/LeadStatus/Index', [
        //     'lead_statuses' => LeadStatusResource::collection(LeadStatus::all()),
        // ]);
    }

    public function create()
    {
        return Inertia::render('SuperAdmin/Master/LeadStatus/Create');
    }

    public function store(StoreLeadStatusRequest $request, CreateLeadStatus $createLeadStatus)
    {
        $createLeadStatus->execute($request->validated());
        return redirect()->route('superadmin.master.lead-statuses.index')->with('success', 'Lead Status created successfully');
    }

    public function edit(LeadStatus $leadStatus)
    {
        return Inertia::render('SuperAdmin/Master/LeadStatus/Edit', [
            'lead_status' => new LeadStatusResource($leadStatus),
        ]);
    }

    public function update(UpdateLeadStatusRequest $request, LeadStatus $leadStatus, UpdateLeadStatus $updateLeadStatus)
    {
        $updateLeadStatus->execute($leadStatus, $request->validated());
        return redirect()->route('superadmin.master.lead-statuses.index')->with('success', 'Lead Status updated successfully');
    }

    public function destroy(LeadStatus $leadStatus, DeleteLeadStatus $deleteLeadStatus)
    {
        $deleteLeadStatus->execute($leadStatus);
        return redirect()->route('superadmin.master.lead-statuses.index')->with('success', 'Lead Status deleted successfully');
    }
}
