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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            // Cabang mana yang mengelola calon siswa ini
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');

            // Data Pribadi (Hampir sama dengan Student)
            $table->string('name');
            $table->date('dob')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();

            // Data Orang Tua (Penting untuk CRM segmen Kids/Teens)
            $table->string('parent_name')->nullable();
            $table->string('parent_phone')->nullable();

            // Atribut Khusus CRM
            $table->foreignId('lead_source_id')->nullable()->constrained('lead_sources')->onDelete('set null');
            $table->enum('status', ['new', 'contacted', 'follow_up', 'placement_test', 'joined', 'lost'])->default('new');
            $table->text('notes')->nullable(); // Catatan admin (misal: "Tertarik IELTS tapi masih ragu jadwal")

            // Level yang diminati (Relasi ke tabel levels nanti)
            $table->foreignId('interest_level_id')
                ->nullable()
                ->constrained('levels')
                ->onDelete('set null');

            $table->foreignId('interest_package_id')
                ->nullable()
                ->constrained('packages')
                ->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
