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

            // Metode follow up (Bisa untuk nampilin icon WA/Telepon di UI)
            $table->enum('method', ['whatsapp', 'call', 'email', 'meeting'])->default('whatsapp');

            // Status follow up
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');

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
