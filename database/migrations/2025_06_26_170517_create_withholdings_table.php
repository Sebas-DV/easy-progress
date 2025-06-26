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
        Schema::create('withholdings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->constrained();
            $table->foreignUuid('establishment_id')->constrained();
            $table->foreignUuid('emission_point_id')->constrained();
            $table->foreignUuid('supplier_id')->constrained();
            $table->foreignUuid('purchase_id')->constrained();
            $table->string('sequential_number', 9);
            $table->string('access_key', 49)->nullable();
            $table->string('authorization_number')->nullable();
            $table->dateTime('authorization_code')->nullable();
            $table->date('issue_date');
            $table->enum('type', ['electronic', 'physical']);
            $table->enum('status', ['draft', 'issued', 'authorized', 'cancelled']);
            $table->decimal('total_retained', 12)->default(0);
            $table->string('xml_file')->nullable();
            $table->string('pdf_file')->nullable();
            $table->foreignUuid('user_id')->constrained();

            $table->timestamps();

            $table->unique(['company_id', 'establishment_id', 'emission_point_id', 'sequential_number']);
            $table->index(['company_id', 'issue_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('withholdings');
    }
};
