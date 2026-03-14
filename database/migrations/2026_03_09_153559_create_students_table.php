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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            // Akun Login
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Cabang Pendaftaran
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');

            // Data Pribadi Siswa
            $table->string('name');
            $table->date('dob')->nullable(); // Date of Birth
            $table->string('phone')->nullable(); // No HP Siswa (jika ada)
            $table->text('address')->nullable();

            // Data Orang Tua / Wali
            $table->string('parent_name')->nullable();
            $table->string('parent_phone')->nullable(); // No HP penting untuk WA Billing/Progress

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
