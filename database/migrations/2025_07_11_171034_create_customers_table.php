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
        Schema::create('customers', function (Blueprint $table)
        {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->constrained()->cascadeOnDelete();
            $table->enum('identification_type', ['04', '05', '06', '07', '08']);
            $table->string('identification_number', 20);
            $table->string('business_name');
            $table->string('commercial_name')->nullable();
            $table->enum('person_type', ['natural', 'juridica'])->default('natural');

            // Contact
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('country', 2)->default('EC');
            $table->string('postal_code', 10)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('mobile', 20)->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();

            // Commercial Information
            $table->decimal('credit_limit', 12, 2)->default(0);
            $table->integer('credit_days')->default(0);
            $table->foreignUuid('payment_term_id')->nullable();
            $table->foreignUuid('price_list_id')->nullable();
            $table->foreignUuid('seller_id')->nullable()->constrained('users')->onDelete('set null');

            // Additional Information
            $table->string('contact_name')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);

            // Sri Report
            $table->boolean('is_related_party')->default(false);
            $table->boolean('is_rise_contributor')->default(false);

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
        Schema::dropIfExists('customers');
    }
};
