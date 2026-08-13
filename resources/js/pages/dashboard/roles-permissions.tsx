import { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import { Shield, Check, Save } from "lucide-react";

interface PermissionItem {
  id: number;
  name: string;
}

interface RoleItem {
  id: number;
  name: string;
  permissions: PermissionItem[];
}

interface Props {
  roles: RoleItem[];
  groupedPermissions: Record<string, PermissionItem[]>;
}

export default function RolesPermissions({ roles, groupedPermissions }: Props) {
  const [selectedRole, setSelectedRole] = useState<RoleItem>(roles[0] || null);

  // Track active permission names for the selected role
  const [assignedPermissions, setAssignedPermissions] = useState<string[]>(
    selectedRole ? selectedRole.permissions.map((p) => p.name) : []
  );

  const handleRoleSelect = (role: RoleItem) => {
    setSelectedRole(role);
    setAssignedPermissions(role.permissions.map((p) => p.name));
  };

  const togglePermission = (permName: string) => {
    setAssignedPermissions((prev) =>
      prev.includes(permName)
        ? prev.filter((p) => p !== permName)
        : [...prev, permName]
    );
  };

  const handleSave = () => {
    if (!selectedRole) return;

    router.put(
      `/dashboard/roles/${selectedRole.id}/permissions`,
      { permissions: assignedPermissions },
      {
        preserveScroll: true,
      }
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Role Permissions</h1>
        <p className="text-sm text-muted-foreground">
          Manage and assign fine-grained permissions to user roles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Role Selection Column */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider px-1">
            Roles
          </h2>
          <div className="space-y-1">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  selectedRole?.id === role.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="size-4" />
                  <span className="capitalize">{role.name}</span>
                </div>
                <span className="text-xs opacity-70">
                  {role.id === selectedRole?.id
                    ? assignedPermissions.length
                    : role.permissions.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Grid Column */}
        {selectedRole && (
          <div className="md:col-span-3 space-y-6 p-6 rounded-xl border bg-card text-card-foreground shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <h3 className="text-lg font-semibold capitalize">
                  {selectedRole.name} Permissions
                </h3>
                <p className="text-xs text-muted-foreground">
                  Select permissions to assign to the {selectedRole.name} role.
                </p>
              </div>

              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
              >
                <Save className="size-4" />
                <span>Save Changes</span>
              </button>
            </div>

            {/* Grouped Permission Checkboxes */}
            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(([group, perms]) => (
                <div key={group} className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-1">
                    {group}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {perms.map((perm) => {
                      const isChecked = assignedPermissions.includes(perm.name);

                      return (
                        <label
                          key={perm.id}
                          onClick={() => togglePermission(perm.name)}
                          className={`flex items-center gap-3 p-3 rounded-lg border text-xs font-medium cursor-pointer select-none transition-all ${
                            isChecked
                              ? "border-primary/50 bg-primary/5 text-foreground"
                              : "border-border text-muted-foreground hover:border-foreground/20"
                          }`}
                        >
                          <div
                            className={`size-4 rounded flex items-center justify-center border transition-colors ${
                              isChecked
                                ? "bg-primary border-primary text-primary-foreground"
                                : "border-input bg-background"
                            }`}
                          >
                            {isChecked && <Check className="size-3 stroke-[3]" />}
                          </div>
                          <span className="truncate">{perm.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}