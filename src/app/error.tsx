'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div id="error-page" className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <AlertTriangle className="mb-4 h-16 w-16 text-amber-500" />
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Something went wrong</h1>
      <p className="mt-2 max-w-md text-slate-600 dark:text-slate-400">{error.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700"
      >
        Try again
      </button>
    </div>
  );
}
