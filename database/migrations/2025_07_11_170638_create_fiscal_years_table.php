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
        Schema::create('fiscal_years', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->constrained()->restrictOnDelete();
            $table->year('year');
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_closed')->default(false);
            $table->datetime('closed_at')->nullable();
            $table->foreignUuid('closed_by')->nullable()->constrained('users')->onDelete('set null');

            $table->timestamps();

            $table->unique(['company_id', 'year']);
            $table->index(['company_id', 'is_closed']);
            $table->index(['company_id', 'start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fiscal_years');
    }
};
