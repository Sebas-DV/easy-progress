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
        Schema::table('users', function (Blueprint $table)
        {
            $table->foreignUuid('current_company_id')
                ->nullable()
                ->after('current_team_id')
                ->constrained('companies')
                ->nullOnDelete();

            $table->index('current_company_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table)
        {
            $table->dropForeign(['current_company_id']);
            $table->dropColumn('current_company_id');
        });
    }
};
