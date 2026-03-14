<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the root URL request.
     *
     * Redirects authenticated users to their dashboard and guests to the login page.
     */
    public function root()
    {
        if (Auth::check()) {
            // User is logged in, redirect to the central dashboard route
            // which will then handle the role-specific redirection.
            return redirect()->route('dashboard');
        }

        // User is not logged in, redirect to the login page.
        return redirect()->route('login');
    }

    /**
     * Handle the dashboard gateway request.
     *
     * Redirects authenticated users to their role-specific dashboard.
     */
    public function index(Request $request)
    {
        $role = $request->user()->role;

        return match ($role) {
            'superadmin' => redirect()->route('superadmin.dashboard'),
            'frontdesk'  => redirect()->route('frontdesk.dashboard'),
            'teacher'    => redirect()->route('teacher.dashboard'),
            'student'    => redirect()->route('student.dashboard'),
            default      => redirect()->route('login'), // Fallback for any unknown roles
        };
    }
}
