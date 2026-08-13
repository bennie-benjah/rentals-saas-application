<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The plain `role` string column (user | reviewer | admin) was a stopgap
 * added before Spatie's laravel-permission was wired in. Every controller
 * now checks hasRole()/hasAnyRole() against Spatie's roles table instead —
 * this column is dead and kept around would just be a second, driftable
 * source of truth. Dropping it. `account_type` (landlord | tenant) is a
 * separate concept — what kind of account this is — and stays.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('user')->after('email');
        });
    }
};
