<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Distinct from the `role` column added for document review
            // (user/reviewer/admin) — this tracks what kind of account it is.
            $table->string('account_type')->nullable()->after('role'); // landlord | tenant
        });

        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('landlord_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('type')->nullable(); // apartment | standalone | commercial etc.
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->unsignedSmallInteger('year_built')->nullable();
            $table->unsignedInteger('total_units')->nullable();
            $table->decimal('monthly_rent', 12, 2)->nullable();
            $table->json('amenities')->nullable();
            $table->timestamps();
        });

        Schema::create('landlord_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // owner
            $table->string('owner_type')->nullable(); // individual | company
            $table->date('dob')->nullable();
            $table->string('id_type')->nullable();
            $table->string('id_number')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();

            // business
            $table->string('legal_name')->nullable();
            $table->string('entity_type')->nullable();
            $table->string('tax_id')->nullable();
            $table->string('years_operating')->nullable();
            $table->string('portfolio_size')->nullable();
            $table->string('website')->nullable();

            // payouts
            $table->string('payout_method')->nullable(); // bank | mpesa | paypal
            $table->string('bank_name')->nullable();
            $table->string('account_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('routing_number')->nullable();
            $table->string('mpesa_number')->nullable();
            $table->string('paypal_email')->nullable();
            $table->string('currency')->nullable();

            // verification
            $table->string('proof_type')->nullable();
            $table->boolean('tos_ack')->default(false);
            $table->boolean('tax_ack')->default(false);
            $table->string('signature')->nullable();

            $table->timestamps();
        });

        Schema::create('tenant_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // personal
            $table->date('dob')->nullable();
            $table->string('nationality')->nullable();
            $table->string('id_type')->nullable();
            $table->string('id_number')->nullable();

            // employment
            $table->string('employment_status')->nullable();
            $table->string('employer')->nullable();
            $table->string('job_title')->nullable();
            $table->decimal('monthly_income', 12, 2)->nullable();
            $table->string('employed_since')->nullable();
            $table->string('employer_phone')->nullable();

            // history
            $table->string('prev_address')->nullable();
            $table->string('prev_landlord')->nullable();
            $table->string('prev_landlord_phone')->nullable();
            $table->string('reason_leaving')->nullable();
            $table->string('ref_name')->nullable();
            $table->string('ref_phone')->nullable();
            $table->string('ref_relation')->nullable();
            $table->string('emergency_name')->nullable();
            $table->string('emergency_phone')->nullable();

            // apartment — NOTE: property/unit are plain text for now since
            // the registration form's dropdown is still mock data, not a
            // real lookup against the properties table. Once that dropdown
            // is wired to real properties, replace with a proper
            // nullable foreignId('property_id') + unit reference.
            $table->string('property_name')->nullable();
            $table->string('unit_label')->nullable();
            $table->date('move_in')->nullable();
            $table->string('lease_term')->nullable();
            $table->string('occupants')->nullable();
            $table->string('pets')->nullable();
            $table->string('vehicle')->nullable();

            // agreement
            $table->boolean('bg_consent')->default(false);
            $table->boolean('deposit_ack')->default(false);
            $table->boolean('rules_ack')->default(false);
            $table->string('signature')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenant_profiles');
        Schema::dropIfExists('landlord_profiles');
        Schema::dropIfExists('properties');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('account_type');
        });
    }
};
