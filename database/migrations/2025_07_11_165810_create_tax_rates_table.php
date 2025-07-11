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
        Schema::create('tax_rates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code');
            $table->string('name');
            $table->decimal('rate', 5, 2);
            $table->enum('tax_type', ['IVA', 'ICE', 'IRBPNR']);
            $table->string('sri_code')->nullable();
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->date('valid_from');
            $table->date('valid_until')->nullable();

            $table->timestamps();

            $table->index(['tax_type', 'is_active']);
            $table->index(['is_default', 'is_active']);
            $table->index('valid_from');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tax_rates');
    }
};
