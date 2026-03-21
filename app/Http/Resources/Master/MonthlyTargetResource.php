<?php

namespace App\Http\Resources\Master;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MonthlyTargetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'branch_id' => $this->branch_id,
            'branch_name' => $this->whenLoaded('branch', fn() => $this->branch->name),
            'month' => $this->month,
            'year' => $this->year,
            'target_enrolled' => $this->target_enrolled,
            'created_at' => $this->created_at,
        ];
    }
}
