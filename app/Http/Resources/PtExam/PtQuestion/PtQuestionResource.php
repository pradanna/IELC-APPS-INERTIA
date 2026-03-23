<?php

namespace App\Http\Resources\PtQuestion;

use App\Http\Resources\PtExam\PtExamResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PtQuestionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pt_exam_id' => $this->pt_exam_id,
            'question_text' => $this->question_text,
            'audio_path' => $this->audio_path,
            'points' => $this->points,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            // Load relasi jika dipanggil melalui "with('ptExam')"
            'exam' => new PtExamResource($this->whenLoaded('ptExam')),
        ];
    }
}
