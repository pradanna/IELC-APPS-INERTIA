<?php

namespace Database\Seeders;

use App\Models\Lead;
use App\Models\User;
use App\Models\LeadFollowup;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class LeadFollowupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $leads = Lead::all();
        $users = User::where('role', 'frontdesk')->get();

        if ($leads->isEmpty() || $users->isEmpty()) {
            $this->command->info('Cannot run LeadFollowupSeeder. No leads or frontdesk users found.');
            return;
        }

        foreach ($leads as $lead) {
            LeadFollowup::create([
                'lead_id' => $lead->id,
                'user_id' => $users->random()->id,
                'scheduled_at' => now()->addDays(rand(1, 7)),
                'method' => 'whatsapp',
                'status' => 'pending',
                'notes' => null,
            ]);

            // Update lead's next_followup_date
            $lead->update([
                'next_followup_date' => now()->addDays(rand(1, 7))
            ]);
        }
    }
}
