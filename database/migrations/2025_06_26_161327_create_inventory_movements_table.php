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
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('product_id')->constrained();
            $table->foreignUuid('warehouse_id')->constrained();
            $table->enum('movement_type', ['in', 'out', 'transfer']);
            $table->string('document_type')->nullable();
            $table->uuid('document_id')->nullable();
            $table->decimal('quantity', 12, 4);
            $table->decimal('unit_cost', 12, 4);
            $table->decimal('total_cost', 12, 4);
            $table->decimal('balance_quantity', 12, 4);
            $table->decimal('balance_cost', 12, 4);
            $table->text('notes')->nullable();
            $table->foreignUuid('user_id')->constrained();

            $table->timestamps();

            $table->index(['product_id', 'warehouse_id', 'created_at']);
            $table->index(['document_type', 'document_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};
