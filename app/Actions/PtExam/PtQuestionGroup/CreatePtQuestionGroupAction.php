<?php

namespace App\Actions\PtExam\PtQuestionGroup;

use App\Models\PtExam;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class CreatePtQuestionGroupAction
{
    public function execute(PtExam $ptExam, array $data, ?UploadedFile $audioFile = null)
    {
        return DB::transaction(function () use ($ptExam, $data, $audioFile) {
            $audioPath = null;
            if ($audioFile) {
                $filename = Str::random(40) . '.' . $audioFile->getClientOriginalExtension();
                $audioFile->move(public_path('uploads/pt-groups-media'), $filename);
                $audioPath = 'uploads/pt-groups-media/' . $filename;
            }

            return $ptExam->ptQuestionGroups()->create([
                'instruction' => $data['instruction'],
                'audio_path' => $audioPath,
                'reading_text' => $data['reading_text'] ?? null,
            ]);
        });
    }
}
