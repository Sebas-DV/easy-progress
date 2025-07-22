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
        Schema::create('account_types', function (Blueprint $table)
        {
            $table->uuid('id')->primary();
            $table->string('code');
            $table->string('name');
            $table->enum('nature', ['debit', 'credit']);
            $table->enum('category', ['asset', 'liability', 'equity', 'income', 'expense']);
            $table->enum('financial_statement', ['balance_sheet', 'income_statement']);
            $table->integer('display_order')->default(0);
            $table->boolean('is_system')->default(false);

            $table->timestamps();

            $table->unique('code');
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_types');
    }
};
