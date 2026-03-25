<?php

namespace App\Actions\PtExam;

use App\Models\PtExam;
use Illuminate\Database\Eloquent\Collection;

class GetActivePtExamsAction
{
    public function execute(): Collection
    {
        return PtExam::where('is_active', true)->select('id', 'title')->get();
    }
}
