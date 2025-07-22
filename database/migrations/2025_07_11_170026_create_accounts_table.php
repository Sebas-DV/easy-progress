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
        Schema::create('accounts', function (Blueprint $table)
        {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->constrained()->restrictOnDelete();
            $table->foreignUuid('account_type_id')->constrained()->restrictOnDelete();

            $table->string('code');
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_detail')->default(false);

            $table->boolean('is_active')->default(true);
            $table->integer('level')->default(1);

            $table->boolean('accepts_documents')->default(false);

            $table->boolean('requires_cost_center')->default(false);
            $table->boolean('requires_project')->default(false);
            $table->boolean('is_bank_account')->default(false);
            $table->boolean('is_cash_account')->default(false);

            $table->boolean('is_reconcilable')->default(false);
            $table->boolean('is_deprecated')->default(false);

            $table->timestamps();

            $table->unique(['company_id', 'code']);
            $table->index(['company_id', 'is_active']);
            $table->index(['company_id', 'is_detail']);
            $table->index(['company_id', 'level']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
