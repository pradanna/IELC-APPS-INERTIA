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
        Schema::table('student_scores', function (Blueprint $table) {
            $table->integer('session_number')->default(1)->after('assessment_type');
            
            // Indeks untuk pencarian histori per sesi
            $table->index(['study_class_id', 'assessment_type', 'session_number'], 'class_assessment_session_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_scores', function (Blueprint $table) {
            $table->dropIndex('class_assessment_session_idx');
            $table->dropColumn('session_number');
        });
    }
};
