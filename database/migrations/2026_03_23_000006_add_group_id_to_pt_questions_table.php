<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pt_questions', function (Blueprint $table) {
            $table->foreignId('pt_question_group_id')->nullable()->after('pt_exam_id')->constrained('pt_question_groups')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('pt_questions', function (Blueprint $table) {
            $table->dropForeign(['pt_question_group_id']);
            $table->dropColumn('pt_question_group_id');
        });
    }
};
