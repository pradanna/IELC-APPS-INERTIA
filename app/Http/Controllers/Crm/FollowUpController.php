<?php

namespace App\Http\Controllers\Crm;

use App\Http\Controllers\Controller;
use App\Http\Resources\Lead\LeadFollowupResource as LeadLeadFollowupResource;
use App\Models\LeadFollowup;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FollowUpController extends Controller
{
    public function index(Request $request)
    {
        $query = LeadFollowup::query()
            ->with(['lead', 'user'])
            ->where('status', 'pending');

        $tab = $request->input('tab', 'today');

        if ($tab === 'today') {
            $query->whereDate('scheduled_at', today());
        } elseif ($tab === 'upcoming') {
            $query->whereDate('scheduled_at', '>', today());
        } elseif ($tab === 'overdue') {
            $query->whereDate('scheduled_at', '<', today());
        }

        $followUps = $query->paginate(10);

        return Inertia::render('Crm/FollowUp/Index', [
            'followUps' => LeadLeadFollowupResource::collection($followUps),
            'filters' => ['tab' => $tab],
        ]);
    }
}
