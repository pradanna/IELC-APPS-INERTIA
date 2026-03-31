<?php

namespace Database\Seeders;

use App\Models\Lead;
use App\Models\Student;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Package;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = Package::all();
        $branches = Branch::all();

        if ($packages->isEmpty() || $branches->isEmpty()) {
            return;
        }

        $names = [
            'Rizky Pratama',
            'Siti Aminah',
            'Budi Santoso',
            'Dewi Lestari',
            'Agus Salim'
        ];

        foreach ($names as $index => $name) {
            $branch = $branches->random();
            $package = $packages->random();

            // 1. Create User using Factory to handle UUID and other defaults
            $user = User::factory()->create([
                'email' => Str::slug($name) . '@example.com',
                'password' => bcrypt('password'),
                'role' => 'student',
            ]);

            // 2. Create Lead
            $lead = Lead::create([
                'branch_id' => $branch->id,
                'name' => $name,
                'email' => $user->email,
                'phone' => '0812345678' . $index,
                'interest_level_id' => $package->level_id,
                'interest_package_id' => $package->id,
                'lead_status_id' => 'c0a80101-0000-0000-0000-000000000006', // Joined status
                'lead_source_id' => \App\Models\LeadSource::where('name', 'Walk-in')->first()?->id,
            ]);

            // 3. Create Student
            $student = Student::create([
                'user_id' => $user->id,
                'lead_id' => $lead->id,
                'nis' => 'IELC-' . date('Y') . '-' . str_pad($index + 101, 3, '0', STR_PAD_LEFT),
                'status' => 'active',
            ]);

            // 4. Create PAID Invoice
            // This is the CRITICAL part for the "Pending Plotting" list
            $invoice = Invoice::create([
                'lead_id' => $lead->id,
                'invoice_number' => 'INV/' . date('Ymd') . '/' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                'total_amount' => $package->price,
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            // Create Invoice Item for the package
            InvoiceItem::create([
                'invoice_id' => $invoice->id,
                'description' => $package->name, // The controller checks for name match
                'quantity' => 1,
                'unit_price' => $package->price,
                'subtotal' => $package->price,
            ]);
        }
    }
}
