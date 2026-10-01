'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, setUserActive } from '@/src/lib/api';
import { useAuth } from '@/src/context/AuthContext';
import type { AdminUser, Role } from '@/src/types';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setUsers(await getAllUsers());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load users.');
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  function replaceUser(updated: AdminUser) {
    setUsers((current) =>
      current.map((u) => (u.id === updated.id ? updated : u))
    );
  }

  async function handleRoleChange(id: number, role: Role) {
    setError('');
    setBusyId(id);

    try {
      replaceUser(await updateUserRole(id, role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not change the role.');
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggleActive(target: AdminUser) {
    if (
      target.isActive &&
      !window.confirm(
        'Are you sure you want to deactivate this user? They will not be able to log in.'
      )
    ) {
      return;
    }

    setError('');
    setBusyId(target.id);

    try {
      replaceUser(await setUserActive(target.id, !target.isActive));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the user.');
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-400">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <p className="text-sm text-indigo-400">ADMIN PANEL</p>
      <h1 className="text-2xl font-semibold">Users</h1>
      <p className="mt-1 text-sm text-slate-400">
        Manage users and their roles
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">ID</th>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => {
              const isYou = u.id === currentUser?.id;
              const busy = busyId === u.id;

              return (
                <tr
                  key={u.id}
                  className={`border-b border-white/5 last:border-0 ${
                    u.isActive ? '' : 'opacity-60'
                  }`}
                >
                  <td className="px-6 py-4 text-slate-500">{u.id}</td>

                  <td className="px-6 py-4">
                    {u.email}
                    {isYou && (
                      <span className="ml-2 text-slate-500">(You)</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        u.role === 'ADMIN'
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        u.isActive
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {isYou ? (
                      <span className="text-slate-500">Current account</span>
                    ) : (
                      <div className="flex items-center gap-3">
                        <select
                          value={u.role}
                          disabled={busy || !u.isActive}
                          title={!u.isActive ? 'Activate this user to change their role' : undefined}
                          onChange={(e) =>
                            handleRoleChange(u.id, e.target.value as Role)
                          }
                          className="rounded-lg border border-white/10 bg-[#0d0f1a] px-3 py-1.5 text-sm text-white [color-scheme:dark] disabled:opacity-50"
                        >
                          <option value="MEMBER">MEMBER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>

                        <button
                          onClick={() => handleToggleActive(u)}
                          disabled={busy}
                          className={`rounded-lg px-3 py-1.5 text-sm transition disabled:opacity-50 ${
                            u.isActive
                              ? 'text-red-400 hover:bg-red-500/10'
                              : 'text-emerald-400 hover:bg-emerald-500/10'
                          }`}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}