'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User as UserIcon,
  Ticket,
  Receipt,
  Bus,
  PlusCircle,
  LayoutGrid,
  BarChart3,
  Users,
  Megaphone,
} from 'lucide-react';
import type { UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: typeof UserIcon;
  roles: UserRole[];
}

const items: NavItem[] = [
  { href: '/dashboard/profile', label: 'Profile', icon: UserIcon, roles: ['user', 'vendor', 'admin'] },
  { href: '/dashboard/my-bookings', label: 'My Booked Tickets', icon: Ticket, roles: ['user'] },
  { href: '/dashboard/transactions', label: 'Transaction History', icon: Receipt, roles: ['user'] },
  { href: '/dashboard/vendor/vehicles', label: 'My Vehicles', icon: Bus, roles: ['vendor'] },
  { href: '/dashboard/vendor/add-trip', label: 'Add Trip', icon: PlusCircle, roles: ['vendor'] },
  { href: '/dashboard/vendor/trips', label: 'My Trips', icon: LayoutGrid, roles: ['vendor'] },
  { href: '/dashboard/vendor/revenue', label: 'Revenue Overview', icon: BarChart3, roles: ['vendor'] },
  { href: '/dashboard/admin/users', label: 'Manage Users', icon: Users, roles: ['admin'] },
  { href: '/dashboard/admin/vehicles', label: 'Manage Vehicles', icon: Bus, roles: ['admin'] },
  { href: '/dashboard/admin/advertise', label: 'Advertise Tickets', icon: Megaphone, roles: ['admin'] },
];

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const visible = items.filter((i) => i.roles.includes(role));

  return (
    <aside
      id="dashboard-sidebar"
      className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block dark:border-slate-700 dark:bg-slate-900"
    >
      <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {role} dashboard
      </p>
      <nav className="space-y-1">
        {visible.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                active
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function MobileSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const visible = items.filter((i) => i.roles.includes(role));
  return (
    <div className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white p-3 lg:hidden dark:border-slate-700 dark:bg-slate-900">
      {visible.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium',
              active ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            )}
          >
            <item.icon size={15} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
