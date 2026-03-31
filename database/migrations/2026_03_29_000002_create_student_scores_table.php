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
        Schema::create('student_scores', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Relasi ke Kelas (PK Integer)
            $table->foreignId('study_class_id')->constrained()->onDelete('cascade');
            
            // Relasi ke Siswa (PK Integer)
            // Note: student_id is foreignId because students.id is BigInt
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            
            // Jenis tes: 'mid_term', 'final_term', 'quiz', 'simulation'
            $table->string('assessment_type'); 
            
            // Kolom JSON untuk metrik penilaian dinamis
            $table->json('score_details')->nullable(); 
            
            $table->decimal('total_score', 5, 2)->nullable();
            $table->text('final_feedback')->nullable(); // Kesimpulan guru untuk rapor
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_scores');
    }
};
