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
            'dob' => $this->dob ? $this->dob->format('d M Y') : null,
            'status' => $this->status,
            'notes' => $this->notes,
            'parent_name' => $this->parent_name,
            'parent_phone' => $this->parent_phone,
            'created_at' => $this->created_at->format('d M Y, H:i'),
            'branch' => $this->whenLoaded('branch', fn() => $this->branch->name),
            'interest_package' => $this->whenLoaded('interestPackage', fn() => $this->interestPackage?->name),
            'lead_source' => $this->whenLoaded('leadSource', fn() => $this->leadSource?->name),
        ];
    }
}
