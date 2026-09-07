import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

type UserItem = { id: number; name: string; email: string; role?: string };
type DomainItem = {
    id: number;
    subdomain: string;
    owner: string;
    users_count: number;
    assigned_users: UserItem[];
};

function DomainCard({ domain, allUsers }: { domain: DomainItem; allUsers: UserItem[] }) {
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>('staff');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleUser = (userId: number) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleAssign = () => {
        if (selectedUserIds.length === 0) return;

        setIsSubmitting(true);
        router.post(
            `/admin/domains/${domain.id}/users`,
            { user_ids: selectedUserIds, role: selectedRole },
            {
                onFinish: () => {
                    setIsSubmitting(false);
                    setSelectedUserIds([]);
                },
            }
        );
    };

    const handleRemove = (userId: number) => {
        router.delete(`/admin/domains/${domain.id}/users/${userId}`);
    };

    return (
        <div className="p-4 border rounded-lg bg-card space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
                <div>
                    <h2 className="font-semibold text-lg">{domain.subdomain}.127.0.0.1.nip.io</h2>
                    <p className="text-sm text-muted-foreground">Owner: {domain.owner}</p>
                </div>
            </div>

            {/* Native Dropdown Multi-Select Form */}
            <div className="flex gap-2 items-center">
                <details className="relative">
                    <summary className="px-3 py-2 border rounded text-sm bg-background cursor-pointer list-none select-none">
                        {selectedUserIds.length === 0 ? 'Select Users' : `${selectedUserIds.length} Selected`}
                    </summary>
                    <div className="absolute left-0 top-full mt-1 w-56 p-2 bg-popover border rounded shadow-md z-50 max-h-48 overflow-y-auto space-y-1">
                        {allUsers.map((u) => (
                            <label
                                key={u.id}
                                className="flex items-center space-x-2 p-1.5 rounded hover:bg-muted cursor-pointer text-sm"
                            >
                                <Checkbox
                                    checked={selectedUserIds.includes(u.id)}
                                    onCheckedChange={() => toggleUser(u.id)}
                                />
                                <span>{u.name}</span>
                            </label>
                        ))}
                    </div>
                </details>

                <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="manager">Landlord</SelectItem>
                        <SelectItem value="tenant">Tenant</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                </Select>

                <Button onClick={handleAssign} disabled={isSubmitting || selectedUserIds.length === 0}>
                    Attach ({selectedUserIds.length})
                </Button>
            </div>

            {/* Assigned Users List */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Assigned Users ({domain.assigned_users.length}):</h3>
                {domain.assigned_users.length > 0 ? (
                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                        {domain.assigned_users.map((user) => (
                            <div key={user.id} className="flex justify-between items-center bg-muted/50 p-2 rounded text-sm">
                                <div>
                                    <p className="font-medium">{user.name} <span className="text-xs text-muted-foreground capitalize">({user.role})</span></p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRemove(user.id)}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-muted-foreground italic">No assigned users yet.</p>
                )}
            </div>
        </div>
    );
}

export default function DomainManagement({
    domains = [],
    allUsers = [],
}: {
    domains?: DomainItem[];
    allUsers?: UserItem[];
}) {
    return (
        <div className="p-6 space-y-6">
            <Head title="Domain Management" />
            <h1 className="text-2xl font-bold">Subdomain Access Management</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {domains.map((domain) => (
                    <DomainCard key={domain.id} domain={domain} allUsers={allUsers} />
                ))}
            </div>
        </div>
    );
}
