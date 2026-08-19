import { Link, usePage } from "@inertiajs/react";
import { AlertTriangle, ArrowRight } from "lucide-react";

export function CompleteProfileBanner() {
  const { auth } = usePage<any>().props;
  const user = auth?.user;

  // Don't render if there's no user or profile is already complete
  if (!user || user.profileCompleted) {
    return null;
  }

 const isLandlord = user.roles?.includes("landlord");
const targetUrl = isLandlord ? "/register/landlord" : "/register/tenant";

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3 text-amber-900 dark:text-amber-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>Your profile is incomplete.</strong> Complete your profile details to unlock all features.
          </span>
        </div>
        <Link
          href={targetUrl}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 text-white hover:bg-amber-700 text-xs font-semibold rounded-lg transition-colors shrink-0"
        >
          Complete Profile <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
