'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { getAdminDashboard } from '@/src/lib/api';
import type { AdminDashboard } from '@/src/types';

import { useAuth } from '@/src/context/AuthContext';
import ErrorMessage from '@/src/components/ErrorMessage';
import AdminSidebar from '@/src/components/AdminSidebar';

export default function AdminPage() {
  const { user, isLoading } = useAuth();

  const [dashboard, setDashboard] =
    useState<AdminDashboard | null>(null);

  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (user.role !== 'ADMIN') {
      return;
    }

    async function loadDashboard() {
      try {
        const data = await getAdminDashboard();
        setDashboard(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Something went wrong'
        );
      }
    }

    loadDashboard();
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0d0f1a] text-white flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role !== 'ADMIN') {
    return (
      <main className="min-h-screen bg-[#0d0f1a] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <ErrorMessage message="You are not allowed to access the admin dashboard." />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0d0f1a] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <ErrorMessage message={error} />
        </div>
      </main>
    );
  }

  if (!dashboard) {
    return (
      <main className="min-h-screen bg-[#0d0f1a] text-white flex items-center justify-center">
        <p className="text-gray-400">
          Loading dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0f1a] text-white">

      {/* Top bar */}

      <div className="flex w-full">

        {/* Sidebar */}

        {/* Main content */}
        <section className="min-w-0 flex-1 px-6 py-10 md:px-10">

          {/* Heading */}
          <div className="mb-8">

            <p className="mb-2 text-sm font-medium text-indigo-400">
              ADMIN PANEL
            </p>

            <h1 className="text-3xl font-semibold">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Overview of your DevFlow workspace.
            </p>

          </div>

          {/* Main statistics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-indigo-500/30 hover:bg-white/[0.05]">

              <p className="text-sm text-slate-400">
                Total Users
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {dashboard.totalUsers}
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-indigo-500/30 hover:bg-white/[0.05]">

              <p className="text-sm text-slate-400">
                Total Projects
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {dashboard.totalProjects}
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-indigo-500/30 hover:bg-white/[0.05]">

              <p className="text-sm text-slate-400">
                Total Tasks
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {dashboard.totalTasks}
              </p>

            </div>

          </div>

          {/* Task status */}
          <section className="mt-10">

            <h2 className="mb-4 text-lg font-semibold">
              Task Status
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              {/* TODO */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <div className="flex items-center justify-between">

                  <p className="text-sm text-slate-400">
                    To Do
                  </p>

                  <span className="rounded-full bg-slate-500/20 px-2 py-0.5 text-xs text-slate-400">
                    TODO
                  </span>

                </div>

                <p className="mt-4 text-3xl font-semibold">
                  {dashboard.todoTasks}
                </p>

              </div>

              {/* IN PROGRESS */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <div className="flex items-center justify-between">

                  <p className="text-sm text-slate-400">
                    In Progress
                  </p>

                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                    ACTIVE
                  </span>

                </div>

                <p className="mt-4 text-3xl font-semibold">
                  {dashboard.inProgressTasks}
                </p>

              </div>

              {/* DONE */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <div className="flex items-center justify-between">

                  <p className="text-sm text-slate-400">
                    Completed
                  </p>

                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                    DONE
                  </span>

                </div>

                <p className="mt-4 text-3xl font-semibold">
                  {dashboard.completedTasks}
                </p>

              </div>

            </div>

          </section>

          {/* Quick actions */}
          <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <h2 className="text-lg font-semibold">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Manage your DevFlow workspace.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">

              <Link
                href="/admin/projects"
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white transition hover:from-indigo-400 hover:to-purple-500"
              >
                View Projects
              </Link>

            </div>

          </section>

        </section>

      </div>

    </main>
  );
}