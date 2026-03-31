<?php

namespace App\Http\Controllers\Crm;

use App\Actions\Crm\Lead\UpdateLeadStatus;
use App\Actions\Crm\Lead\SearchLeadsAction;
use App\Actions\Crm\Lead\StoreLeadAction;
use App\Actions\Crm\Lead\UpdateLeadAction;
use App\Actions\Crm\Lead\ExportLeadsAction;
use App\Actions\Crm\Lead\DeleteLeadAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Crm\Lead\StoreLeadRequest;
use App\Http\Requests\Crm\Lead\UpdateLeadStatusRequest;
use App\Http\Resources\Lead\LeadDetailResource as LeadLeadDetailResource;
use App\Models\Lead;
use App\Http\Requests\Crm\Lead\StoreLeadFollowupRequest;
use App\Actions\Crm\Lead\StoreLeadFollowupAction;
use App\Models\MonthlyTarget;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Lead::query();
        
        $branchId = $request->input('branch_id');
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);
        $sourceId = $request->input('lead_source_id');

        // Multi-branch Isolation (Frontdesk only sees their branch leads)
        if ($user->role === 'frontdesk' && $user->frontdesk) {
            $branchId = $user->frontdesk->branch_id;
        }

        if ($branchId && $branchId !== 'all') {
            $query->where('branch_id', $branchId);
        }

        if ($sourceId && $sourceId !== 'all') {
            $query->where('lead_source_id', $sourceId);
        }
        
        if ($request->filled('temperature') && $request->input('temperature') !== 'all') {
            $query->where('temperature', $request->input('temperature'));
        }

        // Apply time-based filter only if NO search is happening
        if (!$request->filled('search') && $month && $year) {
            $query->whereMonth('created_at', $month)->whereYear('created_at', $year);
        }

        // Filter by search query
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $leads = $query->with(['interestLevel', 'interestPackage', 'activities.causer', 'followups.user', 'leadSource', 'branch', 'leadStatus'])
            ->latest()
            ->get();

        // Fetch status IDs dynamically with a search-first approach (more resilient than hardcoded UUIDs)
        $allStatuses = \App\Models\LeadStatus::all();
        $statusIds = $allStatuses->pluck('id', 'name')->mapWithKeys(fn($id, $name) => [strtolower($name) => $id]);
        
        // Find joined status by name (flexible check for 'Joined' or 'Enrolled')
        $joinedStatus = $allStatuses->filter(fn($s) => in_array(strtolower($s->name), ['joined', 'enrolled', 'join']))->first();
        $joinedStatusId = $joinedStatus ? $joinedStatus->id : 'c0a80101-0000-0000-0000-000000000006';


        
        Log::debug("CRM Stats: JoinedStatusId found as {$joinedStatusId} (Name: " . ($joinedStatus?->name ?? 'Default') . ")");

        // Base query for counts (respects branch and source filters)
        $countsQuery = Lead::query();
        if ($branchId && $branchId !== 'all') $countsQuery->where('branch_id', $branchId);
        if ($sourceId && $sourceId !== 'all') $countsQuery->where('lead_source_id', $sourceId);

        // Fetch leads for the chart and table
        // We need leads CREATED in this month OR JOINED in this month to satisfy all dashboard needs
        $dashboardLeadsQuery = (clone $countsQuery)->where(function($q) use ($month, $year, $joinedStatusId) {
            // Case 1: Any lead created this month
            $q->whereMonth('created_at', $month)->whereYear('created_at', $year)
            // Case 2: Any lead who has a joined_at date in this month (VERY IMPORTART: ignore status ID here to be safe)
            ->orWhere(function($sq) use ($month, $year) {
                $sq->whereMonth('joined_at', $month)
                   ->whereYear('joined_at', $year);
            })
            // Case 3: Any lead in Joined status whose joined_at is null but created_at is this month
            ->orWhere(function($sq) use ($month, $year, $joinedStatusId) {
                $sq->where('lead_status_id', $joinedStatusId)
                   ->whereNull('joined_at')
                   ->whereMonth('created_at', $month)
                   ->whereYear('created_at', $year);
            });
        });

        $leads = $dashboardLeadsQuery->with(['interestLevel', 'interestPackage', 'activities.causer', 'followups.user', 'leadSource', 'branch', 'leadStatus'])
            ->latest()
            ->get();

        // Calculate Stats using the dynamically found IDs if possible
        $stats = [
            'total' => (clone $countsQuery)->whereMonth('created_at', $month)->whereYear('created_at', $year)->count(),
            'new' => (clone $countsQuery)->whereMonth('created_at', $month)->whereYear('created_at', $year)
                ->where('lead_status_id', $statusIds['new'] ?? 'c0a80101-0000-0000-0000-000000000001')->count(),
            'contacted' => (clone $countsQuery)->whereMonth('created_at', $month)->whereYear('created_at', $year)
                ->where('lead_status_id', $statusIds['contacted'] ?? 'c0a80101-0000-0000-0000-000000000002')->count(),
            'enrolled' => (clone $countsQuery)->where(function($q) use ($month, $year, $joinedStatusId) {
                    // Inclusion criteria for "Enrolled" KPI
                    $q->where(function($sq) use ($month, $year) {
                        $sq->whereMonth('joined_at', $month)->whereYear('joined_at', $year);
                    })->orWhere(function($sq) use ($month, $year, $joinedStatusId) {
                        $sq->where('lead_status_id', $joinedStatusId)
                           ->whereNull('joined_at')
                           ->whereMonth('created_at', $month)
                           ->whereYear('created_at', $year);
                    });
                })->count(),
            'lost' => (clone $countsQuery)->whereMonth('created_at', $month)->whereYear('created_at', $year)
                ->where('lead_status_id', $statusIds['lost'] ?? 'c0a80101-0000-0000-0000-000000000007')->count(),
        ];

        $targetQuery = MonthlyTarget::where('month', $month)->where('year', $year);
        if ($branchId && $branchId !== 'all') $targetQuery->where('branch_id', $branchId);

        return Inertia::render('Crm/Leads/Index', [
            'filters' => $request->only(['search', 'branch_id', 'month', 'year', 'lead_source_id', 'temperature']),
            'stats' => $stats,
            'monthlyTarget' => (int) $targetQuery->sum('target_enrolled'),
            'monthlyTargets' => $targetQuery->get(),
            'leads' => \App\Http\Resources\Lead\LeadResource::collection($leads)->resolve(),
            'branches' => \App\Models\Branch::all(),
            'leadSources' => \App\Models\LeadSource::all(),
            'levels' => \App\Models\Level::all(),
            'packages' => \App\Models\Package::where('is_active', true)->get(),
            'leadStatuses' => \App\Models\LeadStatus::all(),
        ]);
    }

    public function search(Request $request, SearchLeadsAction $searchLeadsAction)
    {
        $searchTerm = $request->input('query', '');

        if (empty($searchTerm)) {
            return response()->json([]);
        }

        return response()->json($searchLeadsAction->execute($searchTerm, $request->user()));
    }

    public function export(Request $request, ExportLeadsAction $action)
    {
        $callback = $action->execute($request->user(), $request->all());

        return response()->streamDownload($callback, 'leads-data-' . date('Y-m-d') . '.csv', [
            'Content-Type' => 'text/csv',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }

    public function show(Lead $lead)
    {
        // Eager load relationships needed for the detail view
        $lead->load(['branch', 'interestPackage', 'leadSource', 'activities.causer', 'followups.user']);

        // Return the lead detail using a resource
        return new LeadLeadDetailResource($lead);
    }

    public function store(StoreLeadRequest $request, StoreLeadAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return Redirect::back()->with('success', 'Lead created successfully.');
    }

    public function update(Request $request, Lead $lead, UpdateLeadAction $action): RedirectResponse
    {
        $action->execute($lead, $request->all());

        return Redirect::back()->with('success', 'Lead updated successfully.');
    }

    public function storeFollowup(StoreLeadFollowupRequest $request, Lead $lead, StoreLeadFollowupAction $action): RedirectResponse
    {
        $action->execute($lead, $request->validated(), $request->user()->id);

        return Redirect::back()->with('success', 'Follow-up scheduled successfully.');
    }

    /**
     * Update the status of a specific lead.
     *
     * @param UpdateLeadStatusRequest $request
     * @param Lead $lead
     * @param UpdateLeadStatus $action
     * @return RedirectResponse
     */
    public function updateStatus(
        UpdateLeadStatusRequest $request,
        Lead $lead,
        UpdateLeadStatus $action
    ): RedirectResponse {
        try {
            $validatedData = $request->validated();
            Log::info("Memulai proses update status untuk Lead #{$lead->id}", $validatedData);

            $action->execute($lead, $validatedData['lead_status_id']);
            return Redirect::back()->with('success', 'Lead status updated.');
        } catch (\Exception $e) {
            Log::error("Error saat mengupdate status Lead #{$lead->id}: " . $e->getMessage());
            return Redirect::back()->withErrors(['error' => 'Terjadi kesalahan sistem saat mengubah status.']);
        }
    }

    public function reviewProfileUpdate(Request $request, Lead $lead): RedirectResponse
    {
        $request->validate(['action' => 'required|in:accept,reject']);

        if ($request->action === 'accept' && $lead->is_profile_pending) {
            // Get data from cast array or decode if needed
            $newData = $lead->pending_profile_data ?: [];
            
            // Clean data to ensure only relevant fields are updated
            $safeFields = ['name', 'phone', 'email', 'dob', 'address', 'parent_name', 'parent_phone'];
            $updateFields = array_intersect_key($newData, array_flip($safeFields));

            $lead->update(array_merge($updateFields, [
                'pending_profile_data' => null,
                'is_profile_pending' => false,
            ]));

            $message = 'Perubahan profil lead berhasil diterima dan diperbarui.';
        } else {
            // Rejection or manual clear
            $lead->update([
                'pending_profile_data' => null,
                'is_profile_pending' => false,
            ]);

            $message = $request->action === 'reject' ? 'Pembaruan profil ditolak.' : 'Data tertunda berhasil dibersihkan.';
        }

        return Redirect::back()->with('success', $message);
    }

    public function destroy(Lead $lead, DeleteLeadAction $action): RedirectResponse
    {
        $action->execute($lead);

        return Redirect::back()->with('success', 'Lead has been deleted successfully.');
    }
}
