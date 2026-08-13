<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->softDeletes();
            $table->index('landlord_id');
        });

        Schema::table('id_documents', function (Blueprint $table) {
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropIndex(['landlord_id']);
        });

        Schema::table('id_documents', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });
    }
};
