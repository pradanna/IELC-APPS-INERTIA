<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('lead_id')->constrained('leads')->cascadeOnDelete();
            $table->string('invoice_number')->unique();
            $table->decimal('total_amount', 12, 2)->default(0);
            // status enum: 'unpaid', 'partial', 'waiting_verification', 'paid', 'canceled'
            $table->string('status')->default('unpaid');
            $table->date('due_date')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
