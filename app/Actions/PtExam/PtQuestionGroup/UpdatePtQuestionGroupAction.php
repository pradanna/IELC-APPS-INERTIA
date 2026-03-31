<?php

namespace App\Actions\PtExam\PtQuestionGroup;

use App\Models\PtQuestionGroup;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class UpdatePtQuestionGroupAction
{
    public function execute(PtQuestionGroup $ptQuestionGroup, array $data, ?UploadedFile $audioFile = null): PtQuestionGroup
    {
        if ($audioFile) {
            $filename = Str::random(40) . '.' . $audioFile->getClientOriginalExtension();
            $audioFile->move(public_path('uploads/pt-groups-media'), $filename);
            $data['audio_path'] = 'uploads/pt-groups-media/' . $filename;
        }

        $ptQuestionGroup->update([
            'instruction' => $data['instruction'] ?? $ptQuestionGroup->instruction,
            'reading_text' => array_key_exists('reading_text', $data) ? $data['reading_text'] : $ptQuestionGroup->reading_text,
            'audio_path' => $data['audio_path'] ?? $ptQuestionGroup->audio_path,
        ]);

        return $ptQuestionGroup;
    }
}
