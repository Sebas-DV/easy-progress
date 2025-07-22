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
        Schema::create('accounting_periods', function (Blueprint $table)
        {
            $table->uuid('id')->primary();
            $table->foreignUuid('fiscal_year_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->integer('period_number');
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_closed')->default(false);
            $table->datetime('closed_at')->nullable();
            $table->foreignUuid('closed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->boolean('is_adjustment_period')->default(false);

            $table->timestamps();

            $table->unique(['fiscal_year_id', 'period_number']);
            $table->index(['fiscal_year_id', 'is_closed']);
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounting_periods');
    }
};
