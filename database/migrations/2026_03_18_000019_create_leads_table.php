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
            $table->foreignUuid('branch_id')->constrained('branches')->onDelete('cascade');
            $table->string('name');
            $table->date('dob')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('parent_name')->nullable();
            $table->string('parent_phone')->nullable();
            $table->foreignUuid('lead_source_id')->nullable()->constrained('lead_sources')->onDelete('set null');
            $table->foreignUuid('lead_status_id')->default('c0a80101-0000-0000-0000-000000000001')->constrained('lead_statuses');
            // temperature enum: 'cold', 'warm', 'hot'
            $table->string('temperature')->default('warm'); // New field requested by user
            $table->text('notes')->nullable();
            
            // Pending Profile Data (Self-service update for leads)
            $table->text('pending_profile_data')->nullable();
            $table->boolean('is_profile_pending')->default(false);

            $table->foreignUuid('interest_level_id')->nullable()->constrained('levels')->onDelete('set null');
            $table->foreignUuid('interest_package_id')->nullable()->constrained('packages')->onDelete('set null');
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
