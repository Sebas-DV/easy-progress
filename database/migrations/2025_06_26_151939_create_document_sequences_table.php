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
        Schema::create('document_sequences', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('emission_point_id')->constrained();
            $table->enum('document_type', [
                '01', // Invoice
                '02', // Credit Note
                '03', // Debit Note
                '04', // Receipt
                '05', // Proforma Invoice
                '06', // Delivery Note
                '07', // Transport Document
            ]);
            $table->unsignedBigInteger('current_sequential')->default(0);
            $table->unsignedBigInteger('start_sequential')->default(1);
            $table->unsignedBigInteger('end_sequential')->nullable();
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->index(['emission_point_id', 'document_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_sequences');
    }
};
