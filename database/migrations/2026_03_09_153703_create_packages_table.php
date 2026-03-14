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
            $table->id();
            // Menghubungkan ke Level (misal: IELTS, Kids 1)
            $table->foreignId('level_id')->constrained('levels')->onDelete('cascade');

            $table->string('name'); // Nama Paket (misal: "IELTS Intensive - 24 Sessions")
            $table->enum('type', ['group', 'private', 'semi-private'])->default('group');
            $table->integer('sessions_count'); // Jumlah pertemuan
            $table->decimal('price', 15, 2); // Harga paket (IDR)

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
