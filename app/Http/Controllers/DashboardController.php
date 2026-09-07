<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Lease;
use App\Models\MaintenanceRequest;
use App\Models\Message;
use App\Models\Plan;
use App\Models\Property;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $range = $request->query('range', '12M');
        $user = $request->user();

        // Retrieve user roles
        $userRoles = $user->getRoleNames()->toArray(); // Assuming Spatie Permission or similar array
        $isAdmin = in_array('admin', $userRoles);

        // 1. Calculate Active Tenants (Scoped if landlord)
        $activeTenantsQuery = User::whereHas('roles', fn($q) => $q->where('name', 'tenant'))
            ->whereHas('leases', fn($q) => $q->where('status', 'active'));

        if (!$isAdmin) {
            $activeTenantsQuery->whereHas('leases.unit.property', fn($q) => $q->where('landlord_id', $user->id));
        }

        $activeTenantsCount = $activeTenantsQuery->count();

        // 2. Aggregate KPI Stats (Scoped if landlord)
        $stats = $this->getKpiStats($activeTenantsCount, $user, $isAdmin);

        // 3. Dynamic Revenue Chart Performance
        $chartData = $this->getRevenueChartData($range, $user, $isAdmin);

        // 4. Fetch Dashboard Widgets Data
        $recentMessages = Message::with('sender:id,name')
            ->where('receiver_id', Auth::id())
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($msg) => [
                'id'     => $msg->id,
                'name'   => $msg->sender->name ?? 'System',
                'tag'    => $msg->created_at->diffForHumans(),
                'body'   => $msg->body,
                'unread' => is_null($msg->read_at),
            ]);

        // Scope properties based on ownership
        $propertiesQuery = Property::withCount('units')->latest();
        if (!$isAdmin) {
            $propertiesQuery->where('landlord_id', $user->id);
        }

        $properties = $propertiesQuery
            ->take(4)
            ->get()
            ->map(fn($p) => [
                'id'          => $p->id,
                'name'        => $p->name,
                'landlord_id' => $p->landlord_id,
                'img'         => $p->cover_image_path
                    ? Storage::url($p->cover_image_path)
                    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
                'units'       => "{$p->units_count} Units",
                'yield'       => $p->yield_rate ? "{$p->yield_rate}% Yield" : 'N/A',
            ]);

        // Scope maintenance tickets based on ownership
        $ticketsQuery = MaintenanceRequest::with('unit:id,name')->latest();
        if (!$isAdmin) {
            $ticketsQuery->whereHas('unit.property', fn($q) => $q->where('landlord_id', $user->id));
        }

        $tickets = $ticketsQuery->get()->map(fn($ticket) => [
            'id'     => $ticket->id,
            'title'  => $ticket->title,
            'tag'    => $ticket->unit->name ?? 'General',
            'status' => match ($ticket->status) {
                'in_progress' => 'progress',
                'resolved', 'completed', 'done' => 'done',
                default       => 'todo',
            },
        ]);

        // Scope units dropdown based on ownership
        $unitsQuery = Unit::select('id', 'name', 'property_id');
        if (!$isAdmin) {
            $unitsQuery->whereHas('property', fn($q) => $q->where('landlord_id', $user->id));
        }

        // 5. Fetch Database Plans
        $plans = Plan::all()->map(fn($plan) => [
            'id'           => $plan->slug,
            'name'         => $plan->name,
            'price'        => $plan->price,
            'unit'         => $plan->unit ?? '',
            'cta'          => $plan->cta,
            'featured'     => $plan->featured,
            'features'     => $plan->features,
            'includes'     => $plan->includes,
            'not_included' => $plan->not_included ?? [],
        ]);

        return Inertia::render('dashboard/index', [
            'userRoles'          => $userRoles,
            'propertiesCount'    => $isAdmin ? Property::count() : Property::where('landlord_id', $user->id)->count(),
            'activeTenantsCount' => $activeTenantsCount,
            'stats'              => $stats,
            'chartData'          => $chartData,
            'currentRange'       => $range,
            'recentMessages'     => $recentMessages,
            'properties'         => $properties,
            'tickets'            => $tickets,
            'plans'              => $plans,
            'units'              => $unitsQuery->get(),
        ]);
    }

    /**
     * Compute KPI metrics for the header cards.
     */
    private function getKpiStats(int $activeTenantsCount, User $user, bool $isAdmin): array
    {
        $unitsQuery = Unit::query();
        $leasesQuery = Lease::where('status', 'active');
        $invoicesQuery = Invoice::whereMonth('updated_at', now()->month)
            ->whereYear('updated_at', now()->year);
        $ticketsQuery = MaintenanceRequest::whereIn('status', ['pending', 'in_progress']);

        if (!$isAdmin) {
            $unitsQuery->whereHas('property', fn($q) => $q->where('landlord_id', $user->id));
            $leasesQuery->whereHas('unit.property', fn($q) => $q->where('landlord_id', $user->id));
            $invoicesQuery->whereHas('lease.unit.property', fn($q) => $q->where('landlord_id', $user->id));
            $ticketsQuery->whereHas('unit.property', fn($q) => $q->where('landlord_id', $user->id));
        }

        $totalUnits   = $unitsQuery->count();
        $activeLeases = $leasesQuery->count();
        $monthlyRevenue = $invoicesQuery->sum('amount_paid');
        $openTickets = $ticketsQuery->count();

        return [
            'occupancyRate'  => $totalUnits > 0 ? round(($activeLeases / $totalUnits) * 100, 1) . '%' : '0%',
            'monthlyRevenue' => '$' . number_format($monthlyRevenue / 1000, 1) . 'k',
            'activeTenants'  => (string) $activeTenantsCount,
            'openTickets'    => (string) $openTickets,
        ];
    }

    /**
     * Build revenue chart data points based on selected range.
     */
    private function getRevenueChartData(string $range, User $user, bool $isAdmin): Collection
    {
        $isMonthly  = $range !== '30D';
        $groupField = $isMonthly ? "strftime('%m', created_at)" : "strftime('%d', created_at)";
        $sinceDate  = $isMonthly ? now()->subMonths(12) : now()->subDays(30);

        $query = Invoice::select(
            DB::raw("{$groupField} as label"),
            DB::raw("SUM(amount_paid) as total")
        )
            ->where('created_at', '>=', $sinceDate);

        if (!$isAdmin) {
            $query->whereHas('lease.unit.property', fn($q) => $q->where('landlord_id', $user->id));
        }

        $chartRaw = $query
            ->groupBy('label')
            ->orderBy('created_at', 'asc')
            ->get();

        $maxTotal = (float) ($chartRaw->max('total') ?: 1);

        return $chartRaw->map(function ($item) use ($maxTotal, $isMonthly) {
            $total = (float) $item->total;
            $label = $isMonthly
                ? date('M', mktime(0, 0, 0, (int) $item->label, 10))
                : $item->label;

            return [
                'm'      => $label,
                'v'      => round(($total / $maxTotal) * 100),
                'amount' => '$' . number_format($total, 2),
                'peak'   => $total > 0 && $total === $maxTotal,
            ];
        });
    }
}
