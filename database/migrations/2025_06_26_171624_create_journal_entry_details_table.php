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
        Schema::create('journal_entry_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('journal_entry_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('account_id')->constrained();
            $table->text('description')->nullable();
            $table->decimal('debit', 12)->default(0);
            $table->decimal('credit', 12)->default(0);
            $table->string('cost_center')->nullable();
            $table->string('reference_document')->nullable();

            $table->timestamps();

            $table->index('journal_entry_id');
            $table->index('account_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('journal_entry_details');
    }
};
