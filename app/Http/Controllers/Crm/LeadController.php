<?php

namespace App\Http\Controllers\Crm;

use App\Actions\Crm\Lead\UpdateLeadStatus;
use App\Actions\Crm\Lead\SearchLeadsAction;
use App\Actions\Crm\Lead\StoreLeadAction;
use App\Actions\Crm\Lead\UpdateLeadAction;
use App\Actions\Crm\Lead\ExportLeadsAction;
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

        // Multi-branch Isolation (Frontdesk only sees their branch leads)
        if ($user->role === 'frontdesk' && $user->frontdesk) {
            $query->where('branch_id', $user->frontdesk->branch_id);
        }

        // Filter by search query
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $leads = $query->with(['interestLevel', 'interestPackage', 'activities.causer', 'followups.user'])
            ->latest()
            ->get()
            ->map(function ($lead) {
                // Generate URL that will expire in 24 hours
                $lead->profile_update_url = \Illuminate\Support\Facades\URL::temporarySignedRoute(
                    'public.lead.update', 
                    now()->addDay(), 
                    ['lead' => $lead->id]
                );
                return $lead;
            });

        $baseStatsQuery = Lead::query();
        $targetQuery = MonthlyTarget::where('month', now()->month)
            ->where('year', now()->year);

        // Scope stats by branch for frontdesk
        if ($user->role === 'frontdesk' && $user->frontdesk) {
            $baseStatsQuery->where('branch_id', $user->frontdesk->branch_id);
            $targetQuery->where('branch_id', $user->frontdesk->branch_id);
        }



        return Inertia::render('Crm/Leads/Index', [
            'filters' => $request->only('search'),
            'stats' => [
                'total' => (clone $baseStatsQuery)->count(),
                'new' => (clone $baseStatsQuery)->where('lead_status_id', '0ca51d27-0466-41fa-9cd0-02e0b57e7fc0')->count(),
                'contacted' => (clone $baseStatsQuery)->where('lead_status_id', '4c3d8030-22c6-4152-a567-0cc4de7aef92')->count(),
                'enrolled' => (clone $baseStatsQuery)->where('lead_status_id', '9571e1cd-fbda-476c-9a4d-e9cde60b1357')->count(), // 6 = Joined/Enrolled
                'lost' => (clone $baseStatsQuery)->where('lead_status_id', 'e2079de6-e3d8-4f27-802c-7b243fc4a3f1')->count(),
            ],
            'monthlyTarget' => (int) $targetQuery->sum('target_enrolled'),
            'monthlyTargets' => $targetQuery->get(),
            'leads' => $leads,
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
        $callback = $action->execute($request->user(), $request->input('search'));

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
}
