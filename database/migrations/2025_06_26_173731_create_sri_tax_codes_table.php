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
        Schema::create('sri_tax_codes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tax_type');
            $table->string('code');
            $table->string('description');
            $table->decimal('percentage', 5)->nullable();
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->index(['tax_type', 'code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sri_tax_codes');
    }
};
