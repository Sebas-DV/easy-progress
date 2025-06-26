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
        Schema::create('sri_document_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code', 2);
            $table->string('name');
            $table->boolean('is_electronic')->default(false);
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->unique('code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sri_document_types');
    }
};
