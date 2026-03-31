<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lead_followups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained()->cascadeOnDelete();

            // Kapan harus dihubungi? (Pakai dateTime agar bisa set jam)
            $table->dateTime('scheduled_at')->nullable();

            // Metode follow up enum: 'whatsapp', 'call', 'email', 'meeting'
            $table->string('method')->default('whatsapp');

            // Status follow up enum: 'pending', 'completed', 'cancelled'
            $table->string('status')->default('pending');

            // Catatan hasil pembicaraan (Diisi SETELAH frontdesk menghubungi Budi)
            $table->text('notes')->nullable();

            // Siapa admin/frontdesk yang bertugas nge-WA?
            $table->foreignId('user_id')->constrained('users');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lead_followups');
    }
};
