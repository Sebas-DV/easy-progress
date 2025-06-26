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
        Schema::create('cash_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('cash_movement_id')->constrained();
            $table->enum('transaction_type', ['income', 'expense']);
            $table->string('document_type');
            $table->uuid('document_id')->nullable();
            $table->text('description')->nullable();
            $table->decimal('amount', 12);
            $table->foreignUuid('user_id')->constrained();

            $table->timestamps();

            $table->index('cash_movement_id');
            $table->index(['document_type', 'document_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cash_transactions');
    }
};
