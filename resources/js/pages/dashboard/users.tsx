import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';

interface UserItem {
    id: number;
    name: string;
    email: string;
    account_type: string;
    roles: string[];
    created_at: string;
}

interface Props {
    users: {
        data: UserItem[];
    };
    availableRoles: string[];
}

export default function UserManagement({ users, availableRoles }: Props) {
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const handleRoleChange = (userId: number, newRole: string) => {
    setUpdatingId(userId);
    router.put(
        `/dashboard/users/${userId}/roles`,
        { roles: [newRole] },
        {
            onFinish: () => setUpdatingId(null),
        }
    );
};

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">User Management</h1>
                <p className="text-sm text-muted-foreground">Manage user accounts and assign role permissions.</p>
            </div>

            <div className="border rounded-lg overflow-hidden bg-card">
                <table className="w-full text-left text-sm">
                    <thead className="border-b bg-muted/50 text-muted-foreground">
                        <tr>
                            <th className="p-3">User</th>
                            <th className="p-3">Account Type</th>
                            <th className="p-3">Assigned Role</th>
                            <th className="p-3">Joined</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.data.map((user) => (
                            <tr key={user.id} className="hover:bg-muted/30">
                                <td className="p-3">
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                </td>
                                <td className="p-3 capitalize">{user.account_type || '—'}</td>
                                <td className="p-3">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary capitalize">
                                        {user.roles.join(', ') || 'No Role'}
                                    </span>
                                </td>
                                <td className="p-3 text-muted-foreground text-xs">{user.created_at}</td>
                                <td className="p-3 text-right">
                                    <select
                                        disabled={updatingId === user.id}
                                        value={user.roles[0] || ''}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="text-xs border rounded px-2 py-1 bg-background"
                                    >
                                        <option value="" disabled>Select Role</option>
                                        {availableRoles.map((role) => (
                                            <option key={role} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}