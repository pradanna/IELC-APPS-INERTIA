<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pt_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('lead_id')->constrained()->cascadeOnDelete();
            $table->dateTime('scheduled_at')->nullable();
            $table->foreignUuid('pt_exam_id')->constrained()->cascadeOnDelete();
            $table->string('token')->unique(); // Magic Link
            // status enum: 'pending', 'in_progress', 'completed'
            $table->string('status')->default('pending');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->integer('final_score')->nullable();
            $table->string('recommended_level')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pt_sessions');
    }
};
