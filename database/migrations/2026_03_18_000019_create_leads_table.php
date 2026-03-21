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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->string('name');
            $table->date('dob')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('parent_name')->nullable();
            $table->string('parent_phone')->nullable();
            $table->foreignId('lead_source_id')->nullable()->constrained('lead_sources')->onDelete('set null');
            $table->foreignId('lead_status_id')->default(1)->constrained('lead_statuses');
            $table->enum('temperature', ['cold', 'warm', 'hot'])->default('warm'); // New field requested by user
            $table->text('notes')->nullable();
            $table->foreignId('interest_level_id')->nullable()->constrained('levels')->onDelete('set null');
            $table->foreignId('interest_package_id')->nullable()->constrained('packages')->onDelete('set null');
            $table->dateTime('last_contacted_at')->nullable();
            $table->dateTime('next_followup_date')->nullable();
            $table->dateTime('joined_at')->nullable(); // Menandai kapan lead berubah menjadi enrolled
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
