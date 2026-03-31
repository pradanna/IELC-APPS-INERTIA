<?php

namespace App\Http\Resources\Lead;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeadDetailResource extends JsonResource
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
            'address' => $this->address,
            'dob' => $this->dob, // Raw date for input
            'dob_formatted' => $this->dob ? $this->dob->format('d M Y') : null,
            'notes' => $this->notes,
            'lead_status_id' => $this->lead_status_id,
            'branch_id' => $this->branch_id,
            'lead_source_id' => $this->lead_source_id,
            'interest_level_id' => $this->interest_level_id,
            'interest_package_id' => $this->interest_package_id,
            'parent_name' => $this->parent_name,
            'parent_phone' => $this->parent_phone,
            'temperature' => $this->temperature,
            'is_profile_pending' => $this->is_profile_pending,
            'pending_profile_data' => $this->pending_profile_data,
            'profile_update_url' => \Illuminate\Support\Facades\URL::temporarySignedRoute(
                'public.lead.update', 
                now()->addDay(), 
                ['lead' => $this->id]
            ),
            'created_at' => $this->created_at->format('d M Y, H:i'),
            'branch' => $this->whenLoaded('branch', fn() => $this->branch->name),
            'interest_package' => $this->whenLoaded('interestPackage', fn() => $this->interestPackage?->name),
            'source' => $this->whenLoaded('leadSource', fn() => $this->leadSource?->name),

            'activities' => $this->whenLoaded('activities', function () {
                return $this->activities->map(function ($activity) {
                    return [
                        'id' => $activity->id,
                        'description' => $activity->description,
                        'event' => $activity->event,
                        'properties' => $activity->properties,
                        'created_at' => $activity->created_at,
                        // Ambil nama user (causer) yang melakukan aksi
                        'causer' => $activity->causer ? [
                            'id' => $activity->causer->id,
                            'name' => $activity->causer->name,
                        ] : null,
                    ];
                });
            }),

            // 2. Pastikan followups juga dikembalikan
            'followups' => $this->whenLoaded('followups'),
        ];
    }
}
