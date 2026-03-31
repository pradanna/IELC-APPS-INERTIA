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
        Schema::create('attendances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('class_session_id')->constrained()->onDelete('cascade');
            
            // Note: student_id is foreignId because students.id is BigInt
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            
            // Status: present, absent, late, excused
            $table->string('status')->default('present'); 
            
            // Duration of lateness in minutes
            $table->unsignedSmallInteger('late_minutes')
                  ->nullable()
                  ->comment('Hanya diisi jika status kehadiran adalah late');
            
            // Teacher's notes
            $table->text('teacher_notes')->nullable(); 
            
            $table->timestamps();
            
            // Prevent duplicate attendance for the same student in the same session
            $table->unique(['class_session_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
