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
        Schema::create('quotations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->constrained();
            $table->foreignUuid('customer_id')->constrained();
            $table->string('quotation_number');
            $table->date('issue_date');
            $table->date('expiry_date')->nullable();
            $table->enum('status', ['draft', 'sent', 'accepted', 'rejected', 'expired']);

            $table->decimal('subtotal', 12)->default(0);
            $table->decimal('discount', 12)->default(0);
            $table->decimal('tax_amount', 12)->default(0);
            $table->decimal('total', 12)->default(0);

            $table->text('terms_conditions')->nullable();
            $table->text('notes')->nullable();
            $table->foreignUuid('user_id')->constrained();

            $table->timestamps();

            $table->unique(['company_id', 'quotation_number']);
            $table->index(['company_id', 'issue_date']);
            $table->index(['company_id', 'customer_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotations');
    }
};
