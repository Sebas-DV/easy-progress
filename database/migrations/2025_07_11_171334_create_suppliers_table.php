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
        Schema::create('suppliers', function (Blueprint $table)
        {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->constrained()->cascadeOnDelete();

            $table->enum('identification_type', ['04', '05', '06', '07', '08']);
            $table->string('identification_number', 20);

            $table->string('business_name');
            $table->string('commercial_name')->nullable();
            $table->enum('person_type', ['natural', 'juridica'])->default('juridica');

            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('country', 2)->default('EC');
            $table->string('postal_code', 10)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('mobile', 20)->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();

            $table->string('bank_name')->nullable();
            $table->string('bank_account_type')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->string('bank_account_holder')->nullable();
            $table->string('bank_id_number')->nullable();

            $table->foreignUuid('payment_term_id')->nullable();
            $table->decimal('credit_limit', 12, 2)->default(0);
            $table->integer('credit_days')->default(0);

            $table->boolean('subject_to_retention')->default(true);
            $table->string('retention_percentage_ir')->nullable();
            $table->string('retention_percentage_iva')->nullable();

            $table->string('contact_name')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);

            $table->boolean('is_related_party')->default(false);
            $table->boolean('is_rise_contributor')->default(false);
            $table->boolean('pays_income_tax')->default(true);

            $table->timestamps();

            $table->unique(['company_id', 'identification_number']);
            $table->index(['company_id', 'is_active']);
            $table->index(['company_id', 'identification_type']);
            $table->index(['company_id', 'business_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
