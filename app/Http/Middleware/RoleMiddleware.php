<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Cek apakah user sudah login dan role-nya ada di dalam array $roles
        if (! $request->user() || ! in_array($request->user()->role, $roles)) {
            abort(403, 'Unauthorized. You do not have the right role to access this page.');
        }

        return $next($request);
    }
}
