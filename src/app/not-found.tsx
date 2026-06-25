import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div id="not-found-page" className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Compass className="mb-4 h-16 w-16 text-brand-500" />
      <h1 className="text-5xl font-bold text-slate-900 dark:text-white">404</h1>
      <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">This route does not exist on our map.</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700"
      >
        Back to Home
      </Link>
    </div>
  );
}
