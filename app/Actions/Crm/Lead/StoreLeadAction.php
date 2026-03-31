<?php

namespace App\Actions\Crm\Lead;

use App\Actions\Notification\SendNotificationAction;
use App\Models\Lead;
use App\Models\User;

class StoreLeadAction
{
    public function __construct(
        protected SendNotificationAction $sendNotification
    ) {}

    public function execute(array $data): Lead
    {
        // Check if starting status is 'Joined' to set joined_at
        if (isset($data['lead_status_id'])) {
            $status = \App\Models\LeadStatus::find($data['lead_status_id']);
            if ($status && strtolower($status->name) === 'joined') {
                $data['joined_at'] = now();
            }
        }

        $lead = Lead::create($data);

        // Notify Frontdesk in the same branch
        $targets = User::where('role', 'superadmin');

        if ($lead->branch_id) {
            $targets->orWhereHas('frontdesk', function ($q) use ($lead) {
                $q->where('branch_id', $lead->branch_id);
            });
        }

        $users = $targets->get();
        \Log::info("ATTEMPTING TO NOTIFY USERS:", ['count' => $users->count(), 'user_ids' => $users->pluck('id')->toArray()]);

        foreach ($users as $user) {
            $this->sendNotification->execute($user, [
                'title'   => 'New Lead Registered!',
                'message' => "Lead '{$lead->name}' has been created in " . ($lead->branch->name ?? 'your branch'),
                'type'    => 'success',
                'link'    => route('admin.crm.leads.show', $lead->id),
                'icon'    => 'user-plus'
            ]);
        }

        return $lead;
    }
}
