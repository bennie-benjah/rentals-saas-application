<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\LandlordProfile;
use App\Models\Lease;
use App\Models\MaintenanceRequest;
use App\Models\TenantProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TenantController extends Controller
{
    /**
     * Resolve current subdomain and landlord branding context.
     */
    protected function getSubdomainContext(Request $request): array
    {
        $host = $request->getHost();
        $parts = explode('.', $host);
        $subdomain = (count($parts) > 2) ? $parts[0] : null;

        // Ignore common system/app defaults
        if ($subdomain && ! in_array($subdomain, ['www', 'admin', 'app', '127', 'localhost'])) {
            $landlord = LandlordProfile::where('subdomain', $subdomain)->first();

            if ($landlord) {
                return [
                    'subdomain'    => $subdomain,
                    'name'         => $landlord->company_name ?? $landlord->legal_name ?? ucfirst($subdomain),
                    'logo'         => $landlord->website ?? null, // Replace with logo attribute if applicable
                    'landlord_id'  => $landlord->id,
                    'has_custom_domain' => true,
                ];
            }
        }

        // Fallback: Check if user is linked to a landlord profile via domain_user pivot
        $linkedLandlord = $request->user()?->landlordProfiles()->first();

        return [
            'subdomain'    => $linkedLandlord?->subdomain ?? null,
            'name'         => $linkedLandlord?->company_name ?? config('app.name', 'EstateOS'),
            'logo'         => null,
            'landlord_id'  => $linkedLandlord?->id,
            'has_custom_domain' => false,
        ];
    }

    /**
     * Display the Landlord's tenant management list view.
     */
    public function index(Request $request): Response
    {
        $subdomainContext = $this->getSubdomainContext($request);

        $tenantsQuery = TenantProfile::with('user');

        if (! empty($subdomainContext['landlord_id'])) {
            $tenantsQuery->whereHas('user.landlordProfiles', function ($q) use ($subdomainContext) {
                $q->where('landlord_profiles.id', $subdomainContext['landlord_id']);
            });
        }

        $tenants = $tenantsQuery
            ->latest()
            ->get()
            ->map(function ($t) {
                return [
                    'id'     => $t->id,
                    'name'   => $t->user->name ?? 'Unknown Tenant',
                    'email'  => $t->user->email ?? '',
                    'unit'   => trim("{$t->property_name} · {$t->unit_label}", ' ·'),
                    'status' => $t->status ?? 'active',
                    'rent'   => $t->monthly_income ? '$' . number_format($t->monthly_income) : '$0',
                    'since'  => $t->move_in ? $t->move_in->format('M Y') : 'N/A',
                ];
            });

        return Inertia::render('dashboard/tenants', [
            'subdomain' => $subdomainContext,
            'tenants'   => $tenants,
            'stats'     => [
                'active'  => $tenants->where('status', 'active')->count(),
                'pending' => $tenants->where('status', 'pending')->count(),
            ],
        ]);
    }

    /**
     * Display the active lease details for the tenant.
     */
    public function lease(Request $request): Response
    {
        $user = $request->user();
        $subdomainContext = $this->getSubdomainContext($request);

        $lease = Lease::with(['unit.property', 'documents'])
            ->where('tenant_id', $user->id)
            ->where('status', 'active')
            ->latest()
            ->first();

        return Inertia::render('tenant/lease', [
            'subdomain' => $subdomainContext,
            'lease'     => $lease ? [
                'id'              => $lease->id,
                'status'          => strtoupper($lease->status ?? 'active'),
                'propertyName'    => $lease->unit?->property?->name ?? 'Property',
                'unitName'        => $lease->unit?->name ?? 'Unit',
                'startDate'       => $lease->start_date ? $lease->start_date->format('M d, Y') : 'N/A',
                'endDate'         => $lease->end_date ? $lease->end_date->format('M d, Y') : 'N/A',
                'monthlyRent'     => '$' . number_format($lease->rent_amount ?? 0, 2),
                'securityDeposit' => '$' . number_format($lease->security_deposit ?? 0, 2),
                'documents'       => $lease->documents->map(fn ($doc) => [
                    'id'          => $doc->id,
                    'name'        => $doc->name ?? $doc->original_filename,
                    'size'        => $doc->file_size_formatted ?? 'N/A',
                    'downloadUrl' => route('tenant.documents.download', $doc->id),
                ]),
            ] : null,
        ]);
    }

    /**
     * Display the Tenant's personal dashboard.
     */
    public function dashboard(Request $request): Response
    {
        $user = $request->user();
        $subdomainContext = $this->getSubdomainContext($request);

        // 1. Fetch Tenant Profile
        $profile = TenantProfile::where('user_id', $user->id)->first();

        // 2. Fetch Active Lease with Unit & Property
        $lease = Lease::with(['unit.property'])
            ->where('tenant_id', $user->id)
            ->where('status', 'active')
            ->latest()
            ->first();

        // 3. Fetch Next Unpaid / Upcoming Invoice
        $nextInvoice = $lease
            ? Invoice::where('lease_id', $lease->id)
                ->whereIn('status', ['unpaid', 'partial', 'overdue'])
                ->orderBy('due_date', 'asc')
                ->first()
            : null;

        // 4. Fetch Recent Invoices & Payment History
        $invoices = $lease
            ? Invoice::where('lease_id', $lease->id)
                ->latest()
                ->take(5)
                ->get()
                ->map(fn ($inv) => [
                    'id'       => $inv->id,
                    'amount'   => '$' . number_format($inv->amount, 2),
                    'status'   => $inv->status,
                    'due_date' => $inv->due_date ? $inv->due_date->format('M d, Y') : null,
                ])
            : [];

        // 5. Fetch Open Maintenance Requests
        $maintenanceRequests = MaintenanceRequest::where('tenant_id', $user->id)
            ->latest()
            ->take(5)
            ->get()
            ->map(fn ($req) => [
                'id'         => $req->id,
                'title'      => $req->title ?? $req->subject ?? 'Maintenance Issue',
                'status'     => $req->status,
                'created_at' => $req->created_at ? $req->created_at->format('M d, Y') : 'N/A',
            ]);

        $openMaintenanceCount = MaintenanceRequest::where('tenant_id', $user->id)
            ->whereIn('status', ['open', 'in_progress'])
            ->count();

        return Inertia::render('tenant/index', [
            'subdomain' => $subdomainContext,
            'tenant'    => [
                'name'  => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? $profile?->phone,
            ],
            'lease' => $lease ? [
                'id'           => $lease->id,
                'propertyName' => $lease->unit?->property?->name ?? $profile?->property_name ?? 'N/A',
                'unitName'     => $lease->unit?->name ?? $profile?->unit_label ?? 'N/A',
                'rent'         => '$' . number_format($lease->rent_amount ?? 0),
                'tenure'       => $lease->start_date ? (int) $lease->start_date->diffInMonths(now()) . ' months tenure' : 'N/A',
                'startDate'    => $lease->start_date ? $lease->start_date->format('M d, Y') : null,
                'endDate'      => $lease->end_date ? $lease->end_date->format('M d, Y') : null,
            ] : null,
            'nextPayment' => $nextInvoice ? [
                'id'            => $nextInvoice->id,
                'amount'        => '$' . number_format($nextInvoice->amount_due - $nextInvoice->amount_paid, 2),
                'dueDate'       => 'due ' . $nextInvoice->due_date->format('M d'),
                'daysRemaining' => (int) round(now()->diffInDays($nextInvoice->due_date, false)) . ' days',
            ] : null,
            'recentInvoices'       => $invoices,
            'maintenanceRequests'  => $maintenanceRequests,
            'openMaintenanceCount' => $openMaintenanceCount,
        ]);
    }

    /**
     * Display the payment view with active invoice details.
     */
    public function pay(Request $request): Response
    {
        $user = $request->user();
        $subdomainContext = $this->getSubdomainContext($request);

        // 1. Fetch active lease
        $lease = Lease::where('tenant_id', $user->id)
            ->where('status', 'active')
            ->first();

        // 2. Fetch the latest unpaid/due invoice
        $invoice = $lease ? Invoice::with('items')
            ->where('lease_id', $lease->id)
            ->whereIn('status', ['unpaid', 'partial', 'overdue'])
            ->orderBy('due_date', 'asc')
            ->first() : null;

        return Inertia::render('tenant/pay', [
            'subdomain' => $subdomainContext,
            'invoice'   => $invoice ? [
                'id'             => $invoice->id,
                'period'         => $invoice->due_date ? $invoice->due_date->format('F Y') : 'Current Period',
                'dueDateText'    => $invoice->due_date ? 'due ' . $invoice->due_date->format('M d, Y') : 'Due soon',
                'daysRemaining'  => $invoice->due_date ? (int) round(now()->diffInDays($invoice->due_date, false)) : 0,
                'baseRent'       => (float) ($invoice->base_rent_amount ?? $invoice->amount ?? 0),
                'utilities'      => (float) ($invoice->utilities_amount ?? 0),
                'totalDue'       => (float) ($invoice->amount_due - $invoice->amount_paid),
                'formattedTotal' => '$' . number_format($invoice->amount_due - $invoice->amount_paid, 2),
            ] : null,
            'userPhone' => $user->phone ?? '',
        ]);
    }

    /**
     * Handle payment submission.
     */
    public function processPayment(Request $request)
    {
        $validated = $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'method'     => 'required|in:card,ach,mpesa,paypal',
            'phone'      => 'nullable|required_if:method,mpesa|string',
        ]);

        return back()->with('success', 'Payment request submitted successfully.');
    }

    /**
     * Store new tenant invitation.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email'         => 'required|email',
            'property_name' => 'nullable|string|max:255',
            'unit_label'    => 'nullable|string|max:255',
        ]);

        return back()->with('success', 'Tenant invitation sent.');
    }
}