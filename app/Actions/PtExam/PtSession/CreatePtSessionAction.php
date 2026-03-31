<?php

namespace App\Actions\PtExam\PtSession;

use App\Models\PtSession;
use Illuminate\Support\Str;

class CreatePtSessionAction
{
    public function execute(array $data): PtSession
    {
        // Auto-generate unique token for the magic link
        if (empty($data['token'])) {
            $data['token'] = Str::random(40);
        }

        return PtSession::create($data);
    }
}
