<?php

namespace App\Http\Controllers\SuperAdmin\Master;

use App\Http\Controllers\Controller;
use App\Http\Resources\BranchResource;
use App\Http\Resources\LeadSourceResource;
use App\Http\Resources\LevelResource;
use App\Http\Resources\PackageResource;
use App\Http\Resources\LeadStatusResource;
use App\Models\Branch;
use App\Models\LeadSource;
use App\Models\LeadStatus;
use App\Models\Level;
use App\Models\Package;
use Inertia\Inertia;

class MasterDataController extends Controller
{
    public function index()
    {
        // Per ARCHITECTURE_RULES, simple data reads are allowed in controllers.
        // Mengambil semua data branch untuk dikirimkan ke Frontend
        $branches = Branch::all();
        $levels = Level::all();
        $packages = Package::with('level')->get(); // Eager load level relationship
        $leadSources = LeadSource::all();
        $leadStatuses = LeadStatus::all();

        return Inertia::render('SuperAdmin/Master/Index', [
            'branches' => BranchResource::collection($branches),
            'levels' => LevelResource::collection($levels),
            'packages' => PackageResource::collection($packages),
            'leadSources' => LeadSourceResource::collection($leadSources),
            'lead_statuses' => LeadStatusResource::collection($leadStatuses),
        ]);
    }
}
