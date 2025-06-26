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
        Schema::create('bank_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('bank_account_id')->constrained();
            $table->enum('transaction_type', ['deposit', 'withdrawal', 'transfer', 'check', 'fee']);
            $table->date('transaction_date');
            $table->string('referral_number')->nullable();
            $table->string('beneficiary')->nullable();
            $table->text('concept');
            $table->decimal('amount', 12, 2);
            $table->decimal('balance', 12, 2);
            $table->boolean('is_reconciled')->default(false);
            $table->date('reconciliation_date')->nullable();
            $table->foreignUuid('user_id')->constrained();

            $table->timestamps();

            $table->index(['bank_account_id', 'transaction_date']);
            $table->index(['bank_account_id', 'is_reconciled']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_transactions');
    }
};
