<?php

namespace App\Http\Resources\Lead;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeadResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'phone' => $this->phone,
            'email' => $this->email,
            'dob' => $this->dob, // Restored
            'address' => $this->address,
            'parent_name' => $this->parent_name, // Restored
            'parent_phone' => $this->parent_phone, // Restored
            'lead_status_id' => $this->lead_status_id,
            'branch_id' => $this->branch_id,
            'lead_source_id' => $this->lead_source_id, // Restored
            'interest_level_id' => $this->interest_level_id,
            'interest_package_id' => $this->interest_package_id,
            'temperature' => $this->temperature,
            'is_profile_pending' => $this->is_profile_pending,
            'next_followup_date' => $this->followups->where('status', 'pending')->sortBy('scheduled_at')->first()?->scheduled_at,
            'joined_at' => $this->joined_at,
            'notes' => $this->notes,
            'profile_update_url' => \Illuminate\Support\Facades\URL::temporarySignedRoute(
                'public.lead.update', 
                now()->addDay(), 
                ['lead' => $this->id]
            ),
            'branch' => $this->branch?->name,
            'source' => $this->leadSource?->name,
            'interest_package' => $this->interestPackage?->name,
            'interest_level' => $this->interestLevel?->name,
            'lead_status' => $this->leadStatus?->name,
            'created_at' => $this->created_at,
        ];
    }
}
