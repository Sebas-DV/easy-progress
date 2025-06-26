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
        Schema::create('invoice_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('invoice_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('product_id')->constrained();
            $table->string('main_code');
            $table->string('auxiliary_code')->nullable();
            $table->text('description')->nullable();
            $table->decimal('quantity', 12, 4);
            $table->decimal('unit_price', 12, 4);
            $table->decimal('discount', 12)->default(0);
            $table->decimal('subtotal', 12, 2);
            $table->foreignUuid('tax_rate_id')->constrained();
            $table->decimal('tax_base', 12);
            $table->decimal('tax_value', 12);
            $table->decimal('total', 12);

            $table->timestamps();

            $table->index('invoice_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_details');
    }
};
