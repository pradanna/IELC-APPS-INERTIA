<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\MonthlyTarget;
use App\Models\Branch;
use App\Http\Resources\Master\MonthlyTargetResource;
use App\Actions\Master\MonthlyTarget\CreateMonthlyTargetAction;
use App\Actions\Master\MonthlyTarget\UpdateMonthlyTargetAction;
use App\Actions\Master\MonthlyTarget\DeleteMonthlyTargetAction;
use App\Http\Requests\Master\MonthlyTarget\SaveMonthlyTargetRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MonthlyTargetController extends Controller
{
    public function index(): Response
    {
        $targets = MonthlyTarget::with('branch')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();

        return Inertia::render('Master/MonthlyTargets/Index', [
            'monthlyTargets' => MonthlyTargetResource::collection($targets),
            'branches' => Branch::select('id', 'name')->get(),
        ]);
    }

    public function store(SaveMonthlyTargetRequest $request, CreateMonthlyTargetAction $action): RedirectResponse
    {
        $action->execute($request->validated());
        return redirect()->back()->with('success', 'Monthly target created.');
    }

    public function update(SaveMonthlyTargetRequest $request, MonthlyTarget $monthlyTarget, UpdateMonthlyTargetAction $action): RedirectResponse
    {
        $action->execute($monthlyTarget, $request->validated());
        return redirect()->back()->with('success', 'Monthly target updated.');
    }

    public function destroy(MonthlyTarget $monthlyTarget, DeleteMonthlyTargetAction $action): RedirectResponse
    {
        $action->execute($monthlyTarget);
        return redirect()->back()->with('success', 'Monthly target deleted.');
    }
}
