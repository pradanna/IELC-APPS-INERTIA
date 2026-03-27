<?php

namespace App\Http\Resources\Master;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PackageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'level_id'       => $this->level_id,
            'level'          => new LevelResource($this->whenLoaded('level')),
            'description'    => $this->description,
            'type'           => $this->type,
            'sessions_count' => $this->sessions_count,
            'duration_days'  => $this->duration_days,
            'price'          => $this->price, // Keep numeric for frontend form
            'price_formatted' => 'Rp ' . number_format($this->price, 0, ',', '.'),
            'is_active'      => $this->is_active,
            'created_at'     => $this->created_at->format('d M Y, H:i'),
        ];
    }
}
