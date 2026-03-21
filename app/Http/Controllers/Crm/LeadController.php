<?php

namespace App\Http\Controllers\Crm;

use App\Actions\Crm\Lead\UpdateLeadStatus;
use App\Actions\Crm\Lead\SearchLeadsAction;
use App\Actions\Crm\Lead\StoreLeadAction;
use App\Actions\Crm\Lead\ExportLeadsAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\LeadStatus\StoreLeadStatusRequest;
use App\Http\Requests\Master\LeadStatus\UpdateLeadStatusRequest;
use App\Http\Resources\Lead\LeadDetailResource as LeadLeadDetailResource;
use App\Models\Lead;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
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

        // Fetch leads with related data
        $leads = $query->with(['interestLevel', 'interestPackage'])
            ->latest()
            ->get();

        // --- Stats Calculation with Timeline ---
        $timeline = $request->input('timeline', 'today'); // Default to 'today'
        $baseStatsQuery = Lead::query();

        // Scope stats by branch for frontdesk
        if ($user->role === 'frontdesk' && $user->frontdesk) {
            $baseStatsQuery->where('branch_id', $user->frontdesk->branch_id);
        }

        // Apply timeline scoping
        switch ($timeline) {
            case 'today':
                $baseStatsQuery->whereDate('created_at', today());
                break;
            case 'week':
                $baseStatsQuery->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
                break;
            case 'month':
                $baseStatsQuery->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()]);
                break;
                // No default case needed, will return all if timeline is invalid
        }

        return Inertia::render('Crm/Leads/Index', [
            'filters' => $request->only('search'),
            'timeline' => $timeline, // Pass the current timeline to the view
            'stats' => [
                'total' => (clone $baseStatsQuery)->count(),
                'new' => (clone $baseStatsQuery)->where('lead_status_id', 1)->count(),
                'contacted' => (clone $baseStatsQuery)->where('lead_status_id', 2)->count(),
                'enrolled' => (clone $baseStatsQuery)->where('lead_status_id', 5)->count(), // 5 = Joined
                'lost' => (clone $baseStatsQuery)->where('lead_status_id', 6)->count(),
            ],
            'leads' => $leads,
            'branches' => \App\Models\Branch::all(),
            'leadSources' => \App\Models\LeadSource::all(),
            'levels' => \App\Models\Level::all(),
            'packages' => \App\Models\Package::all(),
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
        $lead->load(['branch', 'interestPackage', 'leadSource']);

        // Return the lead detail using a resource
        return new LeadLeadDetailResource($lead);
    }

    public function store(StoreLeadStatusRequest $request, StoreLeadAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return Redirect::back()->with('success', 'Lead created successfully.');
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
        $action->execute($lead, $request->validated()['status']);

        // Redirect back with a success message.
        // The frontend will receive this and can show a toast notification.
        return Redirect::back()->with('success', 'Lead status updated.');
    }
}
