<?php

// database/migrations/xxxx_xx_xx_xxxxxx_create_plans_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique(); // starter, operator, portfolio
            $table->string('name');
            $table->string('tagline');
            $table->string('price');
            $table->string('unit')->nullable();
            $table->string('cta');
            $table->boolean('featured')->default(false);
            $table->json('features');
            $table->json('includes');
            $table->json('not_included')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
