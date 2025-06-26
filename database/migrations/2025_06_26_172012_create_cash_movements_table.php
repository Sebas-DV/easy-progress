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
        Schema::create('cash_movements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('cash_register_id')->constrained();
            $table->foreignUuid('user_id')->constrained();
            $table->dateTime('opening_date');
            $table->dateTime('closing_date')->nullable();
            $table->decimal('opening_balance', 12);
            $table->decimal('cash_sales', 12)->default(0);
            $table->decimal('cash_income', 12)->default(0);
            $table->decimal('cash_expenses', 12)->default(0);
            $table->decimal('expected_balance', 12)->default(0);
            $table->decimal('actual_balance', 12)->default(0);
            $table->decimal('difference', 12)->default(0);
            $table->text('notes')->nullable();
            $table->enum('status', ['open', 'closed'])->default('open');

            $table->timestamps();

            $table->index(['cash_register_id', 'opening_date']);
            $table->index(['cash_register_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cash_movements');
    }
};
