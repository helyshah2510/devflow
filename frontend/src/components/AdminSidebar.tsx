'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Projects', href: '/admin/projects' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Tasks', href: '/admin/tasks' },
  ];

  return (
    <aside className="hidden w-56 shrink-0 border-r border-white/10 py-8 md:block">
      
      <nav className="flex gap-2 overflow-x-auto px-4 md:block md:space-y-2 md:px-0 md:pr-5">
        
        {links.map((link) => {
          const isActive =
            link.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block shrink-0 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-white/[0.06] text-white'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          );
        })}

      </nav>
    </aside>
  );
}