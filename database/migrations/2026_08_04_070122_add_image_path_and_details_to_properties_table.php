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
        Schema::table('properties', function (Blueprint $table) {
            if (!Schema::hasColumn('properties', 'image_path')) {
                $table->string('image_path')->nullable()->after('name');
            }

            if (!Schema::hasColumn('properties', 'type')) {
                $table->string('type')->nullable()->after('image_path');
            }

            if (!Schema::hasColumn('properties', 'address')) {
                $table->string('address')->nullable()->after('type');
            }

            if (!Schema::hasColumn('properties', 'city')) {
                $table->string('city')->nullable()->after('address');
            }

            if (!Schema::hasColumn('properties', 'country')) {
                $table->string('country')->nullable()->after('city');
            }

            if (!Schema::hasColumn('properties', 'year_built')) {
                $table->integer('year_built')->nullable()->after('country');
            }

            if (!Schema::hasColumn('properties', 'total_units')) {
                $table->integer('total_units')->default(0)->after('year_built');
            }

            if (!Schema::hasColumn('properties', 'monthly_rent')) {
                $table->decimal('monthly_rent', 12, 2)->default(0)->after('total_units');
            }

            if (!Schema::hasColumn('properties', 'amenities')) {
                $table->json('amenities')->nullable()->after('monthly_rent');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn([
                'image_path',
                'type',
                'address',
                'city',
                'country',
                'year_built',
                'total_units',
                'monthly_rent',
                'amenities',
            ]);
        });
    }
};