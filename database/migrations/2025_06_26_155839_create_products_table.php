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
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->constrained();
            $table->foreignUuid('category_id')->nullable()->constrained('product_categories');
            $table->foreignUuid('unit_of_measure_id')->constrained();
            $table->foreignUuid('tax_rate_id')->constrained();
            $table->string('code');
            $table->string('barcode')->nullable();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['product', 'service']);
            $table->boolean('is_inventoriable')->default(false);
            $table->decimal('cost', 12, 4)->default(0);
            $table->decimal('minium_stock', 12, 4)->default(0);
            $table->decimal('maximum_stock', 12, 4)->default(0);
            $table->boolean('has_multiple_prices')->default(false);
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->unique(['company_id', 'code']);
            $table->index(['company_id', 'category_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
