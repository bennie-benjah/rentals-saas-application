import { useForm } from "@inertiajs/react";
import { FormEvent, useState, ChangeEvent } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPropertyModal({ isOpen, onClose }: AddPropertyModalProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const { data, setData, post, processing, errors, reset } = useForm<{
    name: string;
    address: string;
    city: string;
    country: string;
    monthly_rent: string;
    total_units: string;
    image: File | null;
  }>({
    name: "",
    address: "",
    city: "",
    country: "",
    monthly_rent: "",
    total_units: "",
    image: null,
  });

  if (!isOpen) return null;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData("image", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post("/dashboard/properties", {
      forceFormData: true, // Required for file uploads in Inertia
      onSuccess: () => {
        reset();
        setPreview(null);
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-background rounded-2xl p-6 ring-1 ring-border shadow-2xl my-auto max-h-[90vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h2 className="text-lg font-semibold font-display">Add New Property</h2>
          <button
            onClick={onClose}
            type="button"
            className="p-1 hover:bg-muted rounded-md text-muted-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Box */}
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Property Photo
            </label>
            <div className="relative w-full h-36 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center bg-surface overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Upload className="size-6" />
                  <span className="text-xs font-medium">Click to upload photo</span>
                  <span className="text-[10px]">PNG, JPG, WEBP up to 2MB</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            {errors.image && (
              <p className="text-xs text-red-500 mt-1">{errors.image}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Property Name *
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              className="w-full px-3 py-2 bg-surface ring-1 ring-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g. Skyline Heights"
              required
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Address
            </label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => setData("address", e.target.value)}
              className="w-full px-3 py-2 bg-surface ring-1 ring-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="120 Marina Blvd"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                City
              </label>
              <input
                type="text"
                value={data.city}
                onChange={(e) => setData("city", e.target.value)}
                className="w-full px-3 py-2 bg-surface ring-1 ring-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                Country
              </label>
              <input
                type="text"
                value={data.country}
                onChange={(e) => setData("country", e.target.value)}
                className="w-full px-3 py-2 bg-surface ring-1 ring-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                Total Units
              </label>
              <input
                type="number"
                value={data.total_units}
                onChange={(e) => setData("total_units", e.target.value)}
                className="w-full px-3 py-2 bg-surface ring-1 ring-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">
                Monthly Rent ($)
              </label>
              <input
                type="number"
                value={data.monthly_rent}
                onChange={(e) => setData("monthly_rent", e.target.value)}
                className="w-full px-3 py-2 bg-surface ring-1 ring-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {processing ? "Saving..." : "Create Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}