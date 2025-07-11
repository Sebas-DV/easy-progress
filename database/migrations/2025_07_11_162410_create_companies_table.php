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
            $table->foreignUuid('team_id')->constrained()->onDelete('cascade');

            // Basic Information
            $table->string('ruc', 13)->unique();
            $table->string('name');
            $table->string('commercial_name')->nullable();
            $table->text('address');
            $table->string('phone', 20)->nullable();
            $table->string('mobile', 20)->nullable();
            $table->string('email')->unique();
            $table->string('website')->nullable();

            // Tributary Information
            $table->enum('taxpayer_type', ['natural', 'juridica'])->default('juridica');
            $table->boolean('obligated_accounting')->default(false);
            $table->string('special_taxpayer_number')->nullable();
            $table->date('special_taxpayer_date')->nullable();
            $table->string('retention_agent_resolution')->nullable();
            $table->date('retention_agent_date')->nullable();
            $table->boolean('is_artisan')->default(false);
            $table->string('artisan_number')->nullable();

            // Electronic Invoicing
            $table->string('electronic_signature_file')->nullable();
            $table->string('electronic_signature_password')->nullable();
            $table->datetime('electronic_signature_expiry')->nullable();
            $table->enum('sri_environment', ['1', '2'])->default('1'); // 1=Pruebas, 2=Producción
            $table->string('sri_token')->nullable();
            $table->datetime('sri_token_expiry')->nullable();

            // General Settings
            $table->string('logo')->nullable();
            $table->string('currency', 3)->default('USD');
            $table->string('timezone')->default('America/Guayaquil');
            $table->boolean('is_active')->default(true);
            $table->json('settings')->nullable();

            $table->timestamps();

            $table->index('team_id');
            $table->index('is_active');
            $table->index(['team_id', 'is_active']);
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
