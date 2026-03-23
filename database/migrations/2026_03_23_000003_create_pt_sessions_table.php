<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pt_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lead_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pt_exam_id')->constrained()->cascadeOnDelete();
            $table->string('token')->unique(); // Magic Link
            $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
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
