'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/tickets', label: 'All Tickets' },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setDropOpen(false);
    router.push('/');
  };

  return (
    <nav
      id="main-navbar"
      className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link id="navbar-logo" href="/" className="flex items-center gap-2">
          <Image src="/favicon.png" alt="Jatri" width={28} height={28} className="rounded-md" />
          <span className="text-xl font-bold text-slate-900 dark:text-white">Jatri</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition',
                pathname === l.href
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-600 hover:text-brand-600 dark:text-slate-300'
              )}
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 dark:text-slate-300"
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="relative hidden md:block">
              <button
                id="navbar-avatar-btn"
                onClick={() => setDropOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{user.name.split(' ')[0]}</span>
              </button>
              {dropOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <Link
                    href="/dashboard"
                    onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <UserIcon size={16} /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            id="navbar-hamburger"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg md:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-700">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="mt-2 flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-center text-sm dark:border-slate-600"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-center text-sm text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
