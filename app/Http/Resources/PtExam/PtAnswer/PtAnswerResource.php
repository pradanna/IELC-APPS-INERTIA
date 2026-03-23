<?php

namespace App\Http\Resources\PtExam\PtAnswer;

use App\Http\Resources\PtExam\PtSession\PtSessionResource;
use App\Http\Resources\PtQuestion\PtQuestionResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PtAnswerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pt_session_id' => $this->pt_session_id,
            'pt_question_id' => $this->pt_question_id,
            'pt_question_option_id' => $this->pt_question_option_id,
            'is_correct' => $this->is_correct,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'session' => new PtSessionResource($this->whenLoaded('ptSession')),
            'question' => new PtQuestionResource($this->whenLoaded('ptQuestion')),
        ];
    }
}
