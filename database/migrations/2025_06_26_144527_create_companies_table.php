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
        Schema::create('companies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('team_id')->constrained();
            $table->string('ruc', 13)->unique();
            $table->string('name');
            $table->string('commercial_name')->nullable();
            $table->text('address')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable();
            $table->string('logo')->nullable();

            $table->string('electronic_signature_file')->nullable();
            $table->string('electronic_signature_password')->nullable();
            $table->boolean('obligated_accounting')->default(false);
            $table->string('special_taxpayer_number')->nullable();
            $table->string('retention_agent_resolution')->nullable();

            $table->enum('sri_environment', ['1', '2'])->default('1');
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->index('team_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
