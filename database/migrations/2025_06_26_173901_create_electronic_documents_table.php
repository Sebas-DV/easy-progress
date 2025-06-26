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
        Schema::create('electronic_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->constrained();
            $table->string('document_type');
            $table->unique('document_id');
            $table->string('access_key', 49)->nullable();
            $table->string('authorization_number')->nullable();
            $table->dateTime('authorization_date')->nullable();
            $table->enum('environment', ['1', '2']);
            $table->enum('status', ['created', 'signed', 'sent', 'received', 'authorized', 'rejected']);
            $table->text('sri_message')->nullable();
            $table->text('xml_content');
            $table->string('xml_file')->nullable();
            $table->string('pdf_file')->nullable();
            $table->integer('send_attempts')->default(0);
            $table->dateTime('last_send_attempt')->nullable();

            $table->timestamps();

            $table->index(['company_id', 'created_at']);
            $table->index(['document_type', 'document_id']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('electronic_documents');
    }
};
