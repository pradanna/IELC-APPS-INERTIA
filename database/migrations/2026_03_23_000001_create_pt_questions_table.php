<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pt_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pt_exam_id')->constrained()->cascadeOnDelete();
            $table->text('question_text');
            $table->string('audio_path')->nullable();
            $table->integer('points')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pt_questions');
    }
};
