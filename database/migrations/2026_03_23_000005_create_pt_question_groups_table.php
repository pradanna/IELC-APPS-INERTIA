<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pt_question_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pt_exam_id')->constrained()->cascadeOnDelete();
            $table->string('instruction'); // Cth: "Listen to the audio to answer Q4-Q7"
            $table->string('audio_path')->nullable(); // Untuk sesi Listening
            $table->text('reading_text')->nullable(); // Untuk sesi Reading (artikel panjang)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pt_question_groups');
    }
};
