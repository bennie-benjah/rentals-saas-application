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
    Schema::create('domain_user', function (Blueprint $table) {
        $table->id();
        $table->foreignId('landlord_profile_id')->constrained()->cascadeOnDelete();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->string('role')->default('member'); // e.g. manager, tenant, staff
        $table->timestamps();

        $table->unique(['landlord_profile_id', 'user_id']);
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('domain_user');
    }
};
