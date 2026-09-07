<?php

namespace App\Http\Middleware;

use App\Models\LandlordProfile;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class IdentifyLandlordSubdomain
{
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost(); // "apex.127.0.0.1.nip.io"
        $baseDomain = config('app.url_base', '127.0.0.1.nip.io');

        // Check if request is targeting a subdomain
        if (Str::contains($host, '.' . $baseDomain)) {
            $subdomain = Str::before($host, '.' . $baseDomain);

            if ($subdomain && $subdomain !== 'www') {
                $landlord = LandlordProfile::where('subdomain', $subdomain)->first();

                if (! $landlord) {
                    abort(404, 'Property portal not found.');
                }

                $request->attributes->set('currentLandlord', $landlord);
            }
        }

        return $next($request);
    }
}