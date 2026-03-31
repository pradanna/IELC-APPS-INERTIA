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
        Schema::create('class_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Relasi ke Kelas (PK Integer)
            $table->foreignId('study_class_id')->constrained()->onDelete('cascade');
            
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            
            // Relasi ke Ruangan Aktual (PK UUID)
            $table->foreignUuid('room_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('branch_id')->constrained()->onDelete('cascade');
            
            // Relasi ke Guru Aktual/Pengganti (PK UUID)
            $table->foreignUuid('teacher_id')->constrained('teachers')->onDelete('cascade');
            
            $table->string('status')->default('scheduled'); // scheduled, completed, canceled, rescheduled
            $table->text('topic_taught')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_sessions');
    }
};
