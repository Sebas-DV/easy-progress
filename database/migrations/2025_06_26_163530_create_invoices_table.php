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
        Schema::create('invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->constrained();
            $table->foreignUuid('establishment_id')->constrained();
            $table->foreignUuid('emission_point_id')->constrained();
            $table->foreignUuid('customer_id')->constrained();
            $table->string('sequential_number', 9);
            $table->string('access_key', 49)->nullable();
            $table->string('authorization_code')->nullable();
            $table->dateTime('authorization_date')->nullable();
            $table->date('issue_date');
            $table->enum('type', ['electronic', 'physical']);
            $table->enum('status', ['draft', 'issued', 'cancelled', 'authorized']);

            $table->decimal('subtotal_iva_0', 12, 2)->default(0);
            $table->decimal('subtotal_iva', 12, 2)->default(0);
            $table->decimal('subtotal_no_iva', 12, 2)->default(0);
            $table->decimal('subtotal_exempt', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('ice_value', 12, 2)->default(0);
            $table->decimal('iva_value', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);

            $table->text('additional_information')->nullable();
            $table->string('xml_file')->nullable();
            $table->string('pdf_file')->nullable();
            $table->foreignUuid('user_id')->constrained();

            $table->timestamps();

            $table->unique(['company_id', 'establishment_id', 'emission_point_id', 'sequential_number']);
            $table->index(['company_id', 'issue_date']);
            $table->index(['company_id', 'customer_id']);
            $table->index('access_key');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
