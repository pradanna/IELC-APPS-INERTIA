<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WhatsAppController extends Controller
{
    public function verifyWebhook(Request $request)
    {
        // Token rahasia buatanmu sendiri
        $my_verify_token = "ielc_rahasia_2026";

        // Tangkap parameter dari Meta
        $mode = $request->query('hub_mode');
        $token = $request->query('hub_verify_token');
        $challenge = $request->query('hub_challenge');

        // Validasi kecocokan token
        if ($mode === 'subscribe' && $token === $my_verify_token) {
            // Meta mewajibkan kita mengembalikan angka challenge ini secara mentah
            return response($challenge, 200);
        }

        // Kalau tokennya beda, tolak!
        return response('Token Tidak Valid', 403);
    }

    public function receiveMessage(Request $request)
    {
        // 1. Tangkap seluruh JSON dari Meta dan catat ke file log Laravel
        Log::info('Raw WA Webhook: ' . $request->getContent());

        // 2. Wajib memberikan balasan 200 OK ke Meta
        // Kalau tidak dibalas 200, Meta akan mengira server kita mati dan
        // akan terus mengirim ulang (spam) pesan ini selama berhari-hari!
        return response('EVENT_RECEIVED', 200);
    }
}
