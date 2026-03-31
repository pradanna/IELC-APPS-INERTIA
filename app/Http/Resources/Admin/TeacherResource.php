<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'phone' => $this->phone,
            'address' => $this->address,
            'bio' => $this->bio,
            'specialization' => $this->specialization,
            'profile_picture' => $this->profile_picture ? asset('uploads/' . $this->profile_picture) : null,
            'user' => [
                'id' => $this->user->id,
                'email' => $this->user->email,
                'role' => $this->user->role,
            ],
            'branches' => $this->branches->map(fn($branch) => [
                'id' => $branch->id,
                'name' => $branch->name,
                'pivot' => [
                    'is_primary' => $branch->pivot->is_primary,
                ],
            ]),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
