<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('study_classes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignUuid('package_id')->constrained('packages')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('study_classes');
    }
};
