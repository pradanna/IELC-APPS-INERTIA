<?php

namespace App\Actions\Notification;

use App\Models\User;
use App\Notifications\SystemNotification;
use Illuminate\Support\Facades\Notification;

class SendNotificationAction
{
    /**
     * @param string $target 'role:frontdesk', 'user:1', or User instance
     * @param array $payload [title, message, link, type, icon]
     */
    public function execute($target, array $payload)
    {
        $users = collect();

        if ($target instanceof User) {
            $users->push($target);
        } elseif (is_string($target)) {
            if (str_starts_with($target, 'role:')) {
                $role = str_replace('role:', '', $target);
                $users = User::where('role', $role)->get();
            } elseif (str_starts_with($target, 'user:')) {
                $userId = str_replace('user:', '', $target);
                $user = User::find($userId);
                if ($user) $users->push($user);
            }
        }

        if ($users->isNotEmpty()) {
            try {
                \Log::info("DISPATCHING SYSTEM NOTIFICATION TO " . $users->count() . " USERS");
                Notification::send($users, new SystemNotification($payload));
                \Log::info("DISPATCH SUCCESSFUL");
            } catch (\Exception $e) {
                \Log::error("BROADCASTING FAILED: " . $e->getMessage(), [
                    'exception' => $e,
                    'users' => $users->pluck('id')->toArray()
                ]);
            }
        }

        return $users;
    }
}
