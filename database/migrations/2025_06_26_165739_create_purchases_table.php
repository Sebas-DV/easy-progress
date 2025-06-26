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
        Schema::create('purchases', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->constrained();
            $table->foreignUuid('supplier_id')->constrained();
            $table->enum('document_type', ['01', '03', '04', '05', '11', '12', '15']);
            $table->string('establishment', 3);
            $table->string('emission_point', 3);
            $table->string('sequential', 9);
            $table->string('authorization_number')->nullable();
            $table->date('issue_date');
            $table->date('accounting_date')->nullable();

            $table->decimal('subtotal_iva_0', 12)->default(0);
            $table->decimal('subtotal_iva', 12)->default(0);
            $table->decimal('subtotal_no_iva', 12)->default(0);
            $table->decimal('subtotal_exempt', 12)->default(0);
            $table->decimal('discount', 12)->default(0);
            $table->decimal('ice_value', 12)->default(0);
            $table->decimal('iva_value', 12)->default(0);
            $table->decimal('total', 12)->default(0);

            $table->enum('status', ['pending', 'paid', 'partial', 'cancelled']);
            $table->foreignUuid('user_id')->constrained();

            $table->timestamps();

            $table->index(['company_id', 'issue_date']);
            $table->index(['company_id', 'supplier_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
