<?php

namespace App\Http\Resources\PtQuestionOption;

use App\Http\Resources\PtExam\PtQuestion\PtQuestionResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PtQuestionOptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pt_question_id' => $this->pt_question_id,
            'option_text' => $this->option_text,
            'is_correct' => $this->is_correct,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'question' => new PtQuestionResource($this->whenLoaded('ptQuestion')),
        ];
    }
}
