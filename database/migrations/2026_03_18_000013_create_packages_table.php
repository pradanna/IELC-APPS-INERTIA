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
        Schema::create('packages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('level_id')->constrained('levels')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            // type enum: 'group', 'private', 'semi-private'
            $table->string('type')->default('group');
            $table->integer('sessions_count');
            $table->integer('duration_days')->default(84); // 12 Weeks default as requested
            $table->decimal('price', 15, 2);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
