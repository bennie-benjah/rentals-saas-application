<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('landlord_profiles', function (Blueprint $table) {
            $table->string('subdomain')->nullable()->unique()->after('user_id');
            $table->string('plan')->default('starter')->after('subdomain');
            $table->enum('subscription_status', ['trialing', 'active', 'past_due', 'canceled'])->default('trialing')->after('plan');
            $table->timestamp('subscription_ends_at')->nullable()->after('subscription_status');
        });
    }

    public function down(): void
    {
        Schema::table('landlord_profiles', function (Blueprint $table) {
            $table->dropColumn(['subdomain', 'plan', 'subscription_status', 'subscription_ends_at']);
        });
    }
};