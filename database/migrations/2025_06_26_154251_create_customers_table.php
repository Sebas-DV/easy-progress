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
        Schema::create('customers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->constrained();
            $table->enum('identification_type', [
                '04', // RUC
                '05', // DNI
                '06', // CE
                '07', // PASSPORT
                '08', // FOREIGN ID
                '09', // OTHER
            ]);
            $table->string('identification_number', 20);
            $table->string('business_name');
            $table->string('comercial_name')->nullable();
            $table->text('address')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('mobile', 20)->nullable();
            $table->string('email')->nullable();
            $table->decimal('credit_limit', 12, 2)->default(0);
            $table->integer('credit_days')->default(0);
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->unique(['company_id', 'identification_number']);
            $table->index(['company_id', 'is_active']);
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
