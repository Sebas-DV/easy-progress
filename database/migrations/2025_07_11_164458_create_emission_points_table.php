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
        Schema::create('emission_points', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('establishment_id')->constrained()->onDelete('cascade');
            $table->string('code', 3);
            $table->string('description');
            $table->enum('type', ['pos', 'office', 'warehouse', 'mobile'])->default('office');
            $table->boolean('is_electronic')->default(true);
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->unique(['establishment_id', 'code']);
            $table->index(['establishment_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emission_points');
    }
};
