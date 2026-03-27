<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicLeadProfileController extends Controller
{
    public function edit(Request $request, Lead $lead)
    {
        if (! $request->hasValidSignature()) {
            abort(401, 'Tautan tidak valid atau sudah kadaluarsa.');
        }

        if ($lead->is_profile_pending && ! session('success')) {
            abort(403, 'Data profil Anda sudah disubmit dan sedang menunggu persetujuan.');
        }

        return Inertia::render('Public/Lead/ProfileForm', [
            'lead' => $lead->only('id', 'name', 'dob', 'phone', 'email', 'address', 'parent_name', 'parent_phone'),
            'signature' => $request->query('signature'),
            'expires' => $request->query('expires'),
        ]);
    }

    public function update(Request $request, Lead $lead)
    {
        if (! $request->hasValidSignature()) {
            abort(401, 'Tautan tidak valid atau sudah kadaluarsa.');
        }

        if ($lead->is_profile_pending) {
            abort(403, 'Data profil Anda sudah disubmit dan sedang menunggu persetujuan.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'dob' => 'nullable|date',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'parent_name' => 'nullable|string|max:255',
            'parent_phone' => 'nullable|string|max:255',
        ]);

        $lead->update([
            'pending_profile_data' => $validated,
            'is_profile_pending' => true,
        ]);

        return redirect()->back()->with('success', 'Data berhasil dikirim dan menunggu verifikasi Admin.');
    }
}
