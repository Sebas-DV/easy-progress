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
        Schema::create('credit_notes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->constrained();
            $table->foreignUuid('establishment_id')->constrained();
            $table->foreignUuid('emission_point_id')->constrained();
            $table->foreignUuid('customer_id')->constrained();
            $table->foreignUuid('inventory_id')->nullable()->constrained();
            $table->string('sequential_number', 9);
            $table->string('access_key', 49)->unique();
            $table->string('authorization_number')->nullable();
            $table->dateTime('authorization_date')->nullable();
            $table->date('issue_date');
            $table->string('modified_document_type', 2);
            $table->string('modified_document_number');
            $table->date('modified_document_date');
            $table->text('reason');
            $table->enum('type', ['electronic', 'physical']);
            $table->enum('status', ['draft', 'issued', 'authorized', 'cancelled']);

            $table->decimal('subtotal_iva_0', 12)->default(0);
            $table->decimal('subtotal_iva', 12)->default(0);
            $table->decimal('subtotal_no_iva', 12)->default(0);
            $table->decimal('subtotal_exempt', 12)->default(0);
            $table->decimal('iva_value', 12)->default(0);
            $table->decimal('total', 12)->default(0);

            $table->string('xml_file')->nullable();
            $table->string('pdf_file')->nullable();
            $table->foreignUuid('user_id')->constrained();

            $table->timestamps();

            $table->unique(['company_id', 'sequential_number', 'establishment_id', 'emission_point_id']);
            $table->index(['company_id', 'issue_date']);
            $table->index('access_key');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credit_notes');
    }
};
