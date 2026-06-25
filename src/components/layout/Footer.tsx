import Link from 'next/link';
import { Mail, Phone, Facebook, CreditCard } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer id="main-footer" className="mt-16 border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Link id="navbar-logo" href="/" className="flex items-center gap-2">
          <Image src="/favicon.png" alt="Jatri" width={28} height={28} className="rounded-md" />
          <span className="text-xl font-bold text-slate-900 dark:text-white">Jatri</span>
        </Link>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Book bus, train, launch &amp; flight tickets easily across Bangladesh.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li><Link href="/" className="hover:text-brand-600">Home</Link></li>
            <li><Link href="/tickets" className="hover:text-brand-600">All Tickets</Link></li>
            <li><Link href="/about" className="hover:text-brand-600">About</Link></li>
            <li><Link href="/contact" className="hover:text-brand-600">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Contact Info</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2"><Mail size={15} /> support@jatri.com</li>
            <li className="flex items-center gap-2"><Phone size={15} /> +880 1700-000000</li>
            <li className="flex items-center gap-2"><Facebook size={15} /> /jatribd</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Payment Methods</h4>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
            <CreditCard size={16} /> Powered by Stripe
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-sm text-slate-500 dark:border-slate-800">
        &copy; 2025 Jatri. All rights reserved.
      </div>
    </footer>
  );
}
