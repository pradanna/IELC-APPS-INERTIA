<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Http\Resources\Lead\LeadSourceResource;
use App\Http\Resources\Lead\LeadStatusResource;
use App\Http\Resources\Master\BranchResource;
use App\Http\Resources\Master\LevelResource;
use App\Http\Resources\Master\PackageResource;
use App\Models\Branch;
use App\Models\LeadSource;
use App\Models\LeadStatus;
use App\Models\Level;
use App\Models\MonthlyTarget;
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

        $monthlyTargets = MonthlyTarget::with('branch')->orderBy('year', 'desc')->orderBy('month', 'desc')->paginate(10);

        $monthlyTargets->getCollection()->transform(function ($target) {
            $target->branch_name = $target->branch->name ?? 'Unknown';
            return $target;
        });

        return Inertia::render('Master/Index', [
            'branches' => BranchResource::collection($branches),
            'levels' => LevelResource::collection($levels),
            'packages' => PackageResource::collection($packages),
            'leadSources' => LeadSourceResource::collection($leadSources),
            'lead_statuses' => LeadStatusResource::collection($leadStatuses),
            'monthlyTargets' => $monthlyTargets,
        ]);
    }
}
