'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Trip } from '@/lib/types';
import { TripCard } from '@/components/trips/TripCard';
import { SearchBar } from '@/components/home/SearchBar';
import { PopularRoutes, WhyChooseUs } from '@/components/home/ExtraSections';
import { Spinner } from '@/components/ui/Spinner';

// Lazy-load below-the-fold heavy slider (Swiper) to reduce initial bundle.
const Hero = dynamic(() => import('@/components/home/Hero').then((m) => m.Hero), {
  ssr: false,
  loading: () => <div className="h-[460px] w-full animate-pulse bg-slate-200 dark:bg-slate-800 sm:h-[560px]" />,
});

export default function HomePage() {
  const [advertised, setAdvertised] = useState<Trip[]>([]);
  const [latest, setLatest] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/trips/advertised'), api.get('/trips/latest')])
      .then(([adRes, latestRes]) => {
        setAdvertised(adRes.data.trips);
        setLatest(latestRes.data.trips);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Hero />
      <SearchBar />

      <section id="advertisement-section" className="container-page py-12">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="section-heading">Featured Tickets</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Hand-picked journeys by our team.</p>
          </div>
          <Link href="/tickets" className="text-sm font-medium text-brand-600 hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><Spinner className="h-8 w-8" /></div>
        ) : advertised.length === 0 ? (
          <p className="py-8 text-slate-500">No featured tickets yet.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {advertised.map((t) => (
              <TripCard key={t._id} trip={t} />
            ))}
          </div>
        )}
      </section>

      <PopularRoutes />

      <section id="latest-tickets-section" className="container-page py-12">
        <h2 className="section-heading">Latest Tickets</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Recently added trips you can book now.</p>
        {loading ? (
          <div className="flex justify-center py-12"><Spinner className="h-8 w-8" /></div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((t) => (
              <TripCard key={t._id} trip={t} />
            ))}
          </div>
        )}
      </section>

      <WhyChooseUs />
    </div>
  );
}
