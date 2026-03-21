<?php

namespace App\Http\Controllers\SuperAdmin\Master;

use App\Actions\Master\Level\CreateLevel;
use App\Actions\Master\Level\DeleteLevel;
use App\Actions\Master\Level\UpdateLevel;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\Level\StoreLevelRequest;
use App\Http\Requests\Master\Level\UpdateLevelRequest;
use App\Models\Level;

class MasterLevelController extends Controller
{
    public function store(StoreLevelRequest $request, CreateLevel $createLevel)
    {
        $createLevel->execute($request->validated());

        return redirect()->back()->with('success', 'Level created successfully.');
    }

    public function update(UpdateLevelRequest $request, Level $level, UpdateLevel $updateLevel)
    {
        $updateLevel->execute($level, $request->validated());

        return redirect()->back()->with('success', 'Level updated successfully.');
    }

    public function destroy(Level $level, DeleteLevel $deleteLevel)
    {
        $deleteLevel->execute($level);

        return redirect()->back()->with('success', 'Level deleted successfully.');
    }
}
