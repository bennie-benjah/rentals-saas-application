<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IdDocumentController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\LeaseController;
use App\Http\Controllers\MaintenanceRequestController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\Auth\LandlordRegisterController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\Webhooks\MpesaWebhookController;
use App\Http\Controllers\Webhooks\PaypalWebhookController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Marketing & Legal Pages
|--------------------------------------------------------------------------
*/

Route::get('/', fn () => Inertia::render('welcome'))->name('home');
Route::get('/pricing/starter', fn () => Inertia::render('pricing/starter'))->name('pricing.starter');
Route::get('/pricing/operator', fn () => Inertia::render('pricing/operator'))->name('pricing.operator');
Route::get('/pricing/portfolio', fn () => Inertia::render('pricing/portfolio'))->name('pricing.portfolio');

Route::prefix('legal')->name('legal.')->group(function () {
    Route::get('/terms', fn () => Inertia::render('legal/terms'))->name('terms');
    Route::get('/privacy', fn () => Inertia::render('legal/privacy'))->name('privacy');
    Route::get('/cookies', fn () => Inertia::render('legal/cookies'))->name('cookies');
    Route::get('/dpa', fn () => Inertia::render('legal/dpa'))->name('dpa');
    Route::get('/security', fn () => Inertia::render('legal/security'))->name('security');
});

/*
|--------------------------------------------------------------------------
| Registration & Onboarding (Guest-Only)
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    Route::get('/register/landlord', [LandlordRegisterController::class, 'create'])->name('register.landlord');
    Route::post('/register/landlord', [LandlordRegisterController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| Landlord Dashboard (Auth + Verified + Role: Landlord/Admin)
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'role:landlord|admin|reviewer'])
    ->name('dashboard');

Route::middleware(['auth', 'verified', 'role:landlord|admin|reviewer'])
    ->prefix('dashboard')
    ->name('dashboard.')
    ->group(function () {
        // Properties & Units
        Route::get('/properties', [PropertyController::class, 'index'])->name('properties');
        Route::post('/properties', [PropertyController::class, 'store'])->name('properties.store');
        Route::patch('/properties/{property}', [PropertyController::class, 'update'])->name('properties.update');
        Route::delete('/properties/{property}', [PropertyController::class, 'destroy'])->name('properties.destroy');

        Route::post('/properties/{property}/units', [UnitController::class, 'store'])->name('units.store');
        Route::patch('/units/{unit}', [UnitController::class, 'update'])->name('units.update');
        Route::delete('/units/{unit}', [UnitController::class, 'destroy'])->name('units.destroy');

        // Tenants & Leases
        Route::get('/tenants', [LeaseController::class, 'index'])->name('tenants');
        Route::post('/leases', [LeaseController::class, 'store'])->name('leases.store');
        Route::patch('/leases/{lease}', [LeaseController::class, 'update'])->name('leases.update');

        // Operations & Messaging
        Route::get('/finance', [InvoiceController::class, 'index'])->name('finance');
        Route::get('/maintenance', [MaintenanceRequestController::class, 'index'])->name('maintenance');
        Route::patch('/maintenance/{maintenance_request}', [MaintenanceRequestController::class, 'update'])->name('maintenance.update');
        Route::get('/messages', [ConversationController::class, 'index'])->name('messages');

        // Announcements
        Route::post('/announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
        Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');

        // Roles & Permissions Management
        Route::get('/roles-permissions', [RolePermissionController::class, 'index'])->name('roles-permissions');
        Route::put('/roles/{role}/permissions', [RolePermissionController::class, 'updateRolePermissions'])->name('roles.update-permissions');
        
        // Settings & Verification
        Route::get('/settings', fn () => Inertia::render('dashboard/settings'))->name('settings');
        Route::get('/verification', fn () => Inertia::render('dashboard/verification'))->name('verification');
    });

/*
|--------------------------------------------------------------------------
| Tenant Portal (Auth + Verified + Role: Tenant)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:tenant|reviewer|admin'])
    ->prefix('tenant')
    ->name('tenant.')
    ->group(function () {
        Route::get('/', [TenantController::class, 'dashboard'])->name('index');
        Route::get('/lease', fn () => Inertia::render('tenant/lease'))->name('lease');
        Route::get('/pay', [InvoiceController::class, 'index'])->name('pay');
        Route::get('/maintenance', [MaintenanceRequestController::class, 'index'])->name('maintenance');
        Route::post('/maintenance', [MaintenanceRequestController::class, 'store'])->name('maintenance.store');
        Route::get('/messages', [ConversationController::class, 'index'])->name('messages');
    });

/*
|--------------------------------------------------------------------------
| Shared Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/conversations/{conversation}', [ConversationController::class, 'show'])->name('conversations.show');
    Route::post('/conversations/{conversation}/messages', [ConversationController::class, 'sendMessage'])->name('conversations.messages.store');
    Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');
    Route::post('/invoices/{invoice}/pay', [PaymentController::class, 'store'])->name('invoices.pay');
});

/*
|--------------------------------------------------------------------------
| Document Verification (Encrypted Storage & Access Control)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->prefix('id-documents')->name('id-documents.')->group(function () {
    Route::post('/', [IdDocumentController::class, 'store'])->name('store');
    Route::get('/', [IdDocumentController::class, 'index'])->middleware('role:admin|reviewer')->name('index');
    Route::get('/my-role', [IdDocumentController::class, 'myRole'])->name('my-role');
    Route::post('/{id}/review', [IdDocumentController::class, 'review'])->middleware('role:admin|reviewer')->name('review');
    Route::post('/{id}/signed-url', [IdDocumentController::class, 'signedUrl'])->name('signed-url');
    Route::get('/{id}/access-log', [IdDocumentController::class, 'accessLog'])->middleware('role:admin|reviewer')->name('access-log');
});

/*
|--------------------------------------------------------------------------
| Webhooks (Public Unauthenticated Excluded from CSRF)
|--------------------------------------------------------------------------
*/

Route::post('/webhooks/mpesa', MpesaWebhookController::class)->name('webhooks.mpesa');
Route::post('/webhooks/paypal', PaypalWebhookController::class)->name('webhooks.paypal');

require __DIR__.'/settings.php';
