<?php

use App\Http\Controllers\Admin\DomainManagementController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\Auth\LandlordRegisterController;
use App\Http\Controllers\Auth\TenantRegisterController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\IdDocumentController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\LandlordPortalController;
use App\Http\Controllers\Landlord\LandlordInvoiceController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\LeaseController;
use App\Http\Controllers\MaintenanceRequestController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\PricingController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\Tenant\NotificationController;
use App\Http\Controllers\Tenant\TenantLeaseController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\Webhooks\MpesaWebhookController;
use App\Http\Controllers\Webhooks\PaypalWebhookController;
use App\Http\Middleware\IdentifyLandlordSubdomain;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Subdomain Tenant Portals ({subdomain}.estateos.com)
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Subdomain Tenant Portals ({subdomain}.127.0.0.1.nip.io)
|--------------------------------------------------------------------------
*/

Route::domain('{subdomain}.' . config('app.url_base'))
    ->middleware(['web', IdentifyLandlordSubdomain::class])
    ->group(function () {
        // Public Landlord Portal Landing Page
        Route::get('/', [LandlordPortalController::class, 'show'])->name('subdomain.portal');

        // Tenant Auth & Onboarding
        Route::get('/register', [TenantRegisterController::class, 'createTenant'])->name('subdomain.tenant.register');
        Route::post('/register', [TenantRegisterController::class, 'storeTenant']);

        // Authenticated Tenant Dashboard
        Route::middleware(['auth', 'verified', 'role:tenant'])->prefix('tenant')->group(function () {
            Route::get('/', [TenantController::class, 'dashboard'])->name('subdomain.tenant.dashboard');
        });
    });

/*
|--------------------------------------------------------------------------
| Public SaaS App & Marketing Pages (Central Domain)
|--------------------------------------------------------------------------
*/

// Home / Welcome Page
Route::get('/', HomeController::class)->name('home');

// Pricing Pages
Route::prefix('pricing')->name('pricing.')->group(function () {
    Route::get('/starter', [PricingController::class, 'starter'])->name('starter');
    Route::get('/operator', [PricingController::class, 'operator'])->name('operator');
    Route::get('/portfolio', [PricingController::class, 'portfolio'])->name('portfolio');
    Route::get('/{slug}', [PricingController::class, 'show'])->name('show');
});

// Subscription
Route::post('/subscribe', [SubscriptionController::class, 'checkout'])->middleware('auth')->name('subscribe');

// Legal Pages
Route::prefix('legal')->name('legal.')->controller(LegalController::class)->group(function () {
    Route::get('/terms', 'terms')->name('terms');
    Route::get('/privacy', 'privacy')->name('privacy');
    Route::get('/cookies', 'cookies')->name('cookies');
    Route::get('/dpa', 'dpa')->name('dpa');
    Route::get('/security', 'security')->name('security');
});
/*
|--------------------------------------------------------------------------
| Global Registration & Onboarding
|--------------------------------------------------------------------------
*/

Route::get('/register/landlord', [LandlordRegisterController::class, 'create'])->name('register.landlord');
Route::post('/register/landlord', [LandlordRegisterController::class, 'store']);

Route::get('/register/tenant', [TenantRegisterController::class, 'createTenant'])->name('register.tenant');
Route::post('/register/tenant', [TenantRegisterController::class, 'storeTenant']);

Route::middleware(['auth'])->group(function () {
    Route::get('/onboarding/role', [OnboardingController::class, 'showRoleSelection'])->name('onboarding.role');
    Route::post('/onboarding/role', [OnboardingController::class, 'setRole'])->name('onboarding.role.set');
});
 
Route::get('/pricing/{slug}', [PlanController::class, 'show'])->name('pricing.show');
/*
|--------------------------------------------------------------------------
| Landlord Dashboard
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'role:landlord|admin|reviewer'])
    ->name('dashboard');

Route::middleware(['auth', 'verified', 'role:landlord|admin|reviewer'])
    ->prefix('dashboard')
    ->name('dashboard.')
    ->group(function () {
        Route::get('/properties', [PropertyController::class, 'index'])->name('properties');
        Route::post('/properties', [PropertyController::class, 'store'])->name('properties.store');
        Route::patch('/properties/{property}', [PropertyController::class, 'update'])->name('properties.update');
        Route::delete('/properties/{property}', [PropertyController::class, 'destroy'])->name('properties.destroy');

        Route::post('/properties/{property}/units', [UnitController::class, 'store'])->name('units.store');
        Route::patch('/units/{unit}', [UnitController::class, 'update'])->name('units.update');
        Route::delete('/units/{unit}', [UnitController::class, 'destroy'])->name('units.destroy');

        // FIXED: Now correctly targets GET /dashboard/tenants
        Route::get('/tenants', [LeaseController::class, 'index'])->name('tenants');

        // FIXED: Now correctly targets POST /dashboard/leases
        Route::post('/leases', [LeaseController::class, 'store'])->name('leases.store');
        Route::patch('/leases/{lease}', [LeaseController::class, 'update'])->name('leases.update');

        Route::get('/finance', [InvoiceController::class, 'index'])->name('finance');
        Route::get('/maintenance', [MaintenanceRequestController::class, 'index'])->name('maintenance');

        // routes/web.php
        Route::patch('/dashboard/maintenance/{maintenanceRequest}/status', [MaintenanceRequestController::class, 'updateStatus'])
            ->name('maintenance.status.update');
        Route::get('/messages', [ConversationController::class, 'index'])->name('messages');

        Route::get('/finance', [LandlordInvoiceController::class, 'index'])->name('finance');
        Route::post('/invoices', [LandlordInvoiceController::class, 'store'])->name('invoices.store');

        Route::post('/announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
        Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');

        Route::get('/roles-permissions', [RolePermissionController::class, 'index'])->name('roles-permissions');
        Route::put('/roles/{role}/permissions', [RolePermissionController::class, 'updateRolePermissions'])->name('roles.update-permissions');

        Route::get('/settings', fn() => Inertia::render('dashboard/settings'))->name('settings');
        Route::get('/verification', fn() => Inertia::render('dashboard/verification'))->name('verification');

        Route::middleware(['role:admin'])->group(function () {
            Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
            Route::put('/users/{user}/roles', [AdminUserController::class, 'updateRoles'])->name('users.update-roles');
            Route::put('/users/{user}/toggle-status', [AdminUserController::class, 'toggleStatus'])->name('users.toggle-status');
        });
        Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export', [ReportController::class, 'export'])->name('reports.export');
    });

Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/domains', [DomainManagementController::class, 'index'])->name('admin.domains.index');
    Route::post('/domains/{domain}/users', [DomainManagementController::class, 'assignUser'])->name('admin.domains.users.assign');
    Route::delete('/domains/{domain}/users/{user}', [DomainManagementController::class, 'removeUser'])->name('admin.domains.users.remove');

});

/*
|--------------------------------------------------------------------------
| Tenant Portal (Central / Direct Fallback)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:tenant'])
    ->prefix('tenant')
    ->name('tenant.')
    ->group(function () {
        Route::get('/', [TenantController::class, 'dashboard'])->name('index');
        Route::get('/lease', [TenantLeaseController::class, 'show'])->name('lease');
        Route::get('/pay', [InvoiceController::class, 'index'])->name('pay');
        Route::get('/invoices/{invoice}/checkout', [InvoiceController::class, 'checkout'])
            ->name('tenant.invoices.checkout');
        Route::get('/maintenance', [MaintenanceRequestController::class, 'index'])->name('maintenance');
        Route::post('/maintenance', [MaintenanceRequestController::class, 'store'])->name('maintenance.store');
        Route::get('/messages', [ConversationController::class, 'index'])->name('messages');
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
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
| Document Verification
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
| Webhooks
|--------------------------------------------------------------------------
*/

Route::post('/webhooks/mpesa', MpesaWebhookController::class)->name('webhooks.mpesa');
Route::post('/webhooks/paypal', PaypalWebhookController::class)->name('webhooks.paypal');

require __DIR__ . '/settings.php';
