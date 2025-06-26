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
        Schema::create('quotation_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('quotation_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('product_id')->constrained();
            $table->foreignUuid('product_price_id')->nullable()->constrained();
            $table->text('description');
            $table->decimal('quantity', 12, 4);
            $table->decimal('unit_price', 12, 4);
            $table->decimal('discount', 12)->default(0);
            $table->decimal('subtotal', 12);
            $table->foreignUuid('tax_rate_id')->constrained();
            $table->decimal('tax_amount', 12);
            $table->decimal('total', 12);

            $table->timestamps();

            $table->index('quotation_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotation_details');
    }
};
