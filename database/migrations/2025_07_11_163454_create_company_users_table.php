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
        Schema::create('company_users', function (Blueprint $table)
        {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->boolean('is_active')->default(false);
            $table->boolean('is_default')->default(false);
            $table->boolean('is_owner')->default(false);
            $table->dateTime('last_accessed_at')->nullable();
            $table->dateTime('invited_at')->nullable();
            $table->dateTime('joined_at')->nullable();
            $table->json('permissions')->nullable();

            $table->timestamps();

            $table->unique(['company_id', 'user_id']);
            $table->index('user_id');
            $table->index(['user_id', 'is_active']);
            $table->index(['user_id', 'is_default']);
            $table->index(['company_id', 'is_owner']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_users');
    }
};
