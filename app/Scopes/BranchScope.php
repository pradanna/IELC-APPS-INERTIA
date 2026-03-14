<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class BranchScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        if (Auth::check() && !Auth::user()->hasRole('superadmin')) {
            if (Auth::user()->hasRole('frontdesk')) {
                $builder->where($model->getTable() . '.branch_id', Auth::user()->frontdesk->branch_id);
            }
        }
    }
}
