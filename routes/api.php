<?php

use App\Http\Controllers\WhatsAppController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/webhook/whatsapp', [WhatsAppController::class, 'verifyWebhook']);
Route::post('/webhook/whatsapp', [WhatsAppController::class, 'receiveMessage']);
