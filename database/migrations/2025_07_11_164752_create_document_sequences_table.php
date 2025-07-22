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
        Schema::create('document_sequences', function (Blueprint $table)
        {
            $table->uuid('id')->primary();
            $table->foreignUuid('emission_point_id')->constrained('emission_points')->cascadeOnDelete();
            $table->enum('document_type', [
                '01', // Factura
                '03', // Liquidación de compra
                '04', // Nota de crédito
                '05', // Nota de débito
                '06', // Guía de remisión
                '07', // Comprobante de retención
            ]);
            $table->unsignedBigInteger('current_sequential')->default(0);
            $table->unsignedBigInteger('start_sequential')->default(1);
            $table->unsignedBigInteger('end_sequential')->nullable();
            $table->date('authorization_date')->nullable();
            $table->string('authorization_number')->nullable();
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->unique(['emission_point_id', 'document_type']);
            $table->index(['emission_point_id', 'is_active']);
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
