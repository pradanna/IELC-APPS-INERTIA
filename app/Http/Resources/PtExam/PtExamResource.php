<?php

namespace App\Http\Resources\PtExam;

use App\Http\Resources\PtExam\PtQuestion\PtQuestionResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PtExamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'duration_minutes' => $this->duration_minutes,
            'is_active' => $this->is_active,
            'questions_count' => $this->whenCounted('questions'),
            'questions' => PtQuestionResource::collection($this->whenLoaded('questions')),
            'question_groups' => $this->whenLoaded('ptQuestionGroups'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
