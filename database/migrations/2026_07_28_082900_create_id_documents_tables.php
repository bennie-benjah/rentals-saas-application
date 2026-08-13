<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Simple role field for admin/reviewer gating. If you later adopt
        // Spatie's laravel-permission package, this column can be dropped
        // in favor of proper roles/permissions tables.
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('user')->after('email'); // user | reviewer | admin
        });

        Schema::create('id_documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('kind'); // tenant_id | tenant_proof_of_income | landlord_id | landlord_ownership_proof
            $table->string('slot');
            $table->string('disk')->default('local');
            $table->string('file_path'); // path within the private disk
            $table->string('file_name');
            $table->unsignedBigInteger('size_bytes');
            $table->string('mime_type');
            $table->string('sha256', 64);
            $table->string('status')->default('pending'); // pending | approved | rejected
            $table->text('review_notes')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['owner_id', 'status']);
        });

        Schema::create('id_document_access_log', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('document_id')->constrained('id_documents')->cascadeOnDelete();
            $table->foreignId('actor_id')->constrained('users')->cascadeOnDelete();
            $table->string('actor_role');
            $table->string('action'); // upload | view | download | review_approve | review_reject | delete
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('document_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('id_document_access_log');
        Schema::dropIfExists('id_documents');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
