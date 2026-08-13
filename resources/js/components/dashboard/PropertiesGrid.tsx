interface PropertyItem {
  id: number;
  name: string;
  img?: string;
  units: string;
  yield: string;
}

interface PropertiesGridProps {
  properties: PropertyItem[];
}

export function PropertiesGrid({ properties = [] }: PropertiesGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-medium text-lg">Featured Properties</h2>
        <button className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors">
          View all
        </button>
      </div>

      {properties.length === 0 ? (
        <p className="text-sm text-muted-foreground">No properties found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.map((p) => (
            <div
              key={p.id}
              className="group p-3 bg-surface rounded-2xl ring-1 ring-border space-y-3 transition-all duration-200 hover:-translate-y-0.5 hover:ring-foreground/15 cursor-pointer"
            >
              <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-1 pb-1 flex items-end justify-between">
                <div>
                  <h3 className="text-sm font-semibold">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">{p.units}</p>
                </div>
                <span className="text-xs font-mono text-foreground">{p.yield}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}