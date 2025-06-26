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
        Schema::create('bank_accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->constrained();
            $table->foreignUuid('bank_id')->constrained();
            $table->foreignUuid('account_id')->nullable()->constrained();
            $table->string('account_number');
            $table->enum('account_type', ['savings', 'checking', 'credit', 'loan']);
            $table->string('currency', 3)->default('USD');
            $table->decimal('initial_balance', 12, 2)->default(0.00);
            $table->decimal('current_balance', 12, 2)->default(0.00);
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->unique(['company_id', 'account_number']);
            $table->index(['company_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_accounts');
    }
};
