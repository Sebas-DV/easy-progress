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
        Schema::create('inventories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('product_id')->constrained();
            $table->foreignUuid('warehouse_id')->constrained();
            $table->decimal('quantity', 12, 4)->default(0);
            $table->decimal('reserved_quantity', 12, 4)->default(0);
            $table->decimal('available_quantity', 12, 4)->virtualAs('quantity - reserved_quantity');

            $table->timestamps();

            $table->unique(['product_id', 'warehouse_id']);
            $table->index('warehouse_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
