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
        Schema::create('accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->constrained();
            $table->foreignUuid('account_type_id')->constrained();
            $table->foreignUuid('parent_id')->nullable()->constrained('accounts');
            $table->string('code');
            $table->string('name');
            $table->text('description')->nullable();
            $table->boolean('is_detail')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('level')->default(1);

            $table->timestamps();

            $table->unique(['company_id', 'code']);
            $table->index(['company_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
