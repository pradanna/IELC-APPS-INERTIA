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
            'email' => 'superadmin@ielc.com',
            'password' => Hash::make('password'),
            'role' => 'superadmin',
        ]);
        Superadmin::factory()->create([
            'user_id' => $superadminUser->id,
            'name' => 'Super Admin',
        ]);

        // Create one more random superadmin
        User::factory()->count(1)->create(['role' => 'superadmin'])->each(function ($user) {
            $user->superadmin()->save(Superadmin::factory()->make());
        });

        // 2. Create Frontdesks
        // Create one specific frontdesk for easy testing
        $soloBranch = Branch::where('name', 'Solo')->first();
        if ($soloBranch) {
            $frontdeskUser = User::factory()->create([
                'email' => 'frontdesk@ielc.com',
                'password' => Hash::make('password'),
                'role' => 'frontdesk',
            ]);
            
            Frontdesk::factory()->create([
                'user_id'   => $frontdeskUser->id,
                'branch_id' => $soloBranch->id,
                'name'      => 'Frontdesk Solo',
            ]);
        }

        // Create random frontdesks for each branch
        $branches->each(function ($branch) {
            User::factory()->count(2)->create(['role' => 'frontdesk'])->each(function ($user) use ($branch) {
                $user->frontdesk()->save(Frontdesk::factory()->make([
                    'branch_id' => $branch->id,
                ]));
            });
        });

        // 3. Create Specific Teachers
        $soloBranch = Branch::where('name', 'Solo')->first();
        $semarangBranch = Branch::where('name', 'Semarang')->first();

        $teacherList = [
            ['name' => 'Harum Natali', 'branch' => 'Solo'],
            ['name' => 'Erlysa Suryanto', 'branch' => 'Solo'],
            ['name' => 'Muhammad Anas', 'branch' => 'Solo'],
            ['name' => 'Angela Suwanto', 'branch' => 'Solo'],
            ['name' => 'Resty Febrianty', 'branch' => 'Solo'],
            ['name' => 'Sekarlita Cintyadewi', 'branch' => 'Solo'],
            ['name' => 'Farras Nalakarti', 'branch' => 'Solo'],
            ['name' => 'Rizky Wahyujati', 'branch' => 'Solo'],
            ['name' => 'Kinanthi Tiasadi', 'branch' => 'Semarang'],
            ['name' => 'Amalia Rahma', 'branch' => 'Solo'],
            ['name' => 'Sofiana Kurnia', 'branch' => 'Solo'],
            ['name' => 'Goldenia Maya Russara', 'branch' => 'Solo'],
            ['name' => 'Naufal Handifakhri', 'branch' => 'Solo'],
            ['name' => 'Hafizh Gozali', 'branch' => 'Solo'],
            ['name' => 'Nenny Himawan', 'branch' => 'Solo'],
            ['name' => 'Nicholas Abe Sanjaya', 'branch' => 'Solo'],
            ['name' => 'Dewi Fajar', 'branch' => 'Solo'],
            ['name' => 'Alvin Athaya Iskandar', 'branch' => 'Solo'],
            ['name' => 'Aida Fatimah', 'branch' => 'Semarang'],
            ['name' => 'Lintang Rona', 'branch' => 'Solo'],
            ['name' => 'Paquita Rahmadini', 'branch' => 'Semarang'],
        ];

        foreach ($teacherList as $tData) {
            $user = User::factory()->create([
                'email' => str_replace(' ', '.', strtolower($tData['name'])) . '@ielc.com',
                'role' => 'teacher',
            ]);
            
            $teacher = Teacher::factory()->create([
                'user_id' => $user->id,
                'name' => $tData['name']
            ]);

            $targetBranch = ($tData['branch'] === 'Semarang') ? $semarangBranch : $soloBranch;
            if ($targetBranch) {
                $targetBranch->teachers()->attach($teacher->id, ['is_primary' => true]);
            }
        }
    }
}
