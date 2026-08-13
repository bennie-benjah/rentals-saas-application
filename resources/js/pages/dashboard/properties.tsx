import { useState, ReactNode } from "react";
import { Plus, Search, Filter } from "lucide-react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { PropertiesGrid } from "@/components/dashboard/PropertiesGrid";
import { AddPropertyModal } from "@/components/dashboard/AddPropertyModal"; // import modal

interface PropertyItem {
  id: number;
  name: string;
  img?: string;
  units: string;
  yield: string;
}

function Properties({ properties = [] }: { properties: PropertyItem[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-medium tracking-tight">
            Properties
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {properties.length} {properties.length === 1 ? "building" : "buildings"}
          </p>
        </div>

        {/* Trigger Modal Open */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="size-4" /> Add property
        </button>
      </div>

      {/* Grid Display */}
      <PropertiesGrid properties={properties} />

      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}

export default Properties;

Properties.layout = (page: ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);