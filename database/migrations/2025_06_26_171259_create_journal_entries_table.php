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
        Schema::create('journal_entries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->constrained();
            $table->foreignUuid('accounting_period_id')->constrained();
            $table->string('entry_number')->unique();
            $table->date('entry_date');
            $table->enum('entry_type', ['opening', 'normal', 'adjustment', 'closing']);
            $table->text('description')->nullable();
            $table->string('reference_type')->nullable();
            $table->uuid('reference_id')->nullable();
            $table->decimal('total_debit', 12)->default(0);
            $table->decimal('total_credit', 12)->default(0);
            $table->enum('status', ['draft', 'posted', 'cancelled']);

            $table->timestamps();

            $table->unique(['company_id', 'entry_number']);
            $table->index(['company_id', 'entry_date']);
            $table->index(['company_id', 'accounting_period_id']);
            $table->index(['company_id', 'reference_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('journal_entries');
    }
};
