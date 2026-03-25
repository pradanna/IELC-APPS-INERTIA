<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Frontdesk;
use App\Models\Student;
use App\Models\Superadmin;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branches = Branch::all();
        if ($branches->isEmpty()) {
            $this->command->warn('No branches found. Skipping UserRoleSeeder.');
            return;
        }

        // 1. Create Superadmins
        // Create one specific superadmin for easy login
        $superadminUser = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@ielc.com',
            'password' => Hash::make('password'),
            'role' => 'superadmin',
        ]);
        Superadmin::factory()->create([
            'user_id' => $superadminUser->id,
            'name' => $superadminUser->name,
        ]);

        // Create one more random superadmin
        User::factory()->count(1)->create(['role' => 'superadmin'])->each(function ($user) {
            $user->superadmin()->save(Superadmin::factory()->make([
                'name' => $user->name, // Ensure the name is consistent
            ]));
        });

        // 2. Create Frontdesks, Teachers, and Students for each branch
        $branches->each(function ($branch) {
            // Create Frontdesks for this branch
            User::factory()->count(2)->create(['role' => 'frontdesk'])->each(function ($user) use ($branch) {
                $user->frontdesk()->save(Frontdesk::factory()->make([
                    'branch_id' => $branch->id,
                    'name' => $user->name, // Ensure the name is consistent
                ]));
            });

            // Create Teachers for this branch
            $teachers = User::factory()->count(5)->create(['role' => 'teacher'])->map(function ($user) {
                return $user->teacher()->save(Teacher::factory()->make([
                    'name' => $user->name, // Ensure the name is consistent
                ]));
            });
            $branch->teachers()->attach($teachers->pluck('id'));
        });
    }
}
