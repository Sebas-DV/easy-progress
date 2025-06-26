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
        Schema::create('withholding_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('withholding_id')->constrained()->onDelete('cascade');
            $table->enum('tax_type', ['1', '2', '6']);
            $table->string('tax_code');
            $table->decimal('tax_base', 12);
            $table->decimal('percentage', 5);
            $table->decimal('retained_value', 12);
            $table->string('fiscal_period', 7);

            $table->timestamps();

            $table->index('withholding_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('withholding_details');
    }
};
