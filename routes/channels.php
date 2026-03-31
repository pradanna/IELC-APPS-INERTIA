<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    \Log::info("Broadcasting Auth Request", ['user_id' => $user->id, 'requested_id' => $id]);
    return (int) $user->id === (int) $id;
});
