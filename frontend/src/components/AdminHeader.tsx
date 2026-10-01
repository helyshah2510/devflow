'use client';

import Link from 'next/link';
import LogoutButton from '@/src/components/LogoutButton';
import { useAuth } from '@/src/context/AuthContext';

export default function AdminHeader() {
    const { user} = useAuth();
    return (
        <header className="border-b border-white/10">

            <div className="flex w-full items-center justify-between px-6 py-5">

                <Link
                    href="/admin"
                    className="text-xl font-semibold"
                >
                    DevFlow
                </Link>

                <div className="flex items-center gap-4">

                    <span className="hidden text-sm text-slate-400 sm:block">
                        {user?.email}
                    </span>

                    <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300">
                        ADMIN
                    </span>

                    <LogoutButton />

                </div>

            </div>
        </header>
    );
}