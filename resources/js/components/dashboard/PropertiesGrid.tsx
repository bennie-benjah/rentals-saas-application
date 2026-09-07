import { useState } from "react";
import { usePage, Link } from "@inertiajs/react";

interface PropertyItem {
  id: number;
  name: string;
  img?: string;
  units: string;
  yield: string;
  landlord_id?: number;
}

interface PropertiesGridProps {
  properties: PropertyItem[];
  userRoles?: string[];
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop";

export function PropertiesGrid({ properties = [], userRoles }: PropertiesGridProps) {
  const { props } = usePage<{
    userRoles?: string[];
    auth?: {
      user?: {
        roles?: string[];
      } | null;
    };
  }>();

  // Retrieve roles either from explicit prop or Inertia page context
  const activeRoles = userRoles || props.userRoles || props.auth?.user?.roles || [];
  const isAdmin = activeRoles.includes("admin");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-medium text-lg">
            {isAdmin ? "All Properties" : "My Properties"}
          </h2>
          {isAdmin && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
              Admin View
            </span>
          )}
        </div>
        <Link
          href="/properties"
          className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          View all
        </Link>
      </div>

      {properties.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {isAdmin ? "No properties found in system." : "No properties assigned to your account."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function PropertyCard({ property }: { property: PropertyItem }) {
  const [imgSrc, setImgSrc] = useState(property.img || DEFAULT_IMAGE);

  return (
    <div className="group p-3 bg-surface rounded-2xl ring-1 ring-border space-y-3 transition-all duration-200 hover:-translate-y-0.5 hover:ring-foreground/15 cursor-pointer">
      <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden">
        <img
          src={imgSrc}
          alt={property.name}
          onError={() => setImgSrc(DEFAULT_IMAGE)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="px-1 pb-1 flex items-end justify-between">
        <div>
          <h3 className="text-sm font-semibold">{property.name}</h3>
          <p className="text-xs text-muted-foreground">{property.units}</p>
        </div>
        <span className="text-xs font-mono text-foreground">{property.yield}</span>
      </div>
    </div>
  );
}
