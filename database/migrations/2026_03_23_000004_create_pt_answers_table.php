<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pt_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pt_session_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pt_question_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pt_question_option_id')->nullable()->constrained()->cascadeOnDelete();
            $table->boolean('is_correct')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pt_answers');
    }
};
