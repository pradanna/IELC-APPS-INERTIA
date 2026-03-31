<?php

namespace App\Http\Resources\PtExam\PtSession;

use App\Http\Resources\Lead\LeadResource;
use App\Http\Resources\PtExam\PtExamResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PtSessionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'lead_id' => $this->lead_id,
            'pt_exam_id' => $this->pt_exam_id,
            'token' => $this->token,
            'status' => $this->status,
            'started_at' => $this->started_at,
            'finished_at' => $this->finished_at,
            'final_score' => $this->final_score,
            'recommended_level' => $this->recommended_level,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'lead' => new LeadResource($this->whenLoaded('lead')),
            'exam' => new PtExamResource($this->whenLoaded('ptExam')),
        ];
    }
}
