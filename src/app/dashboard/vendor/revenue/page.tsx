'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Ticket, TrendingUp, Armchair } from 'lucide-react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { formatBDT } from '@/lib/utils';

const RevenueCharts = dynamic(
  () => import('@/components/dashboard/RevenueCharts').then((m) => m.RevenueCharts),
  { ssr: false, loading: () => <div className="mt-6 h-72 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" /> }
);

interface Stats {
  totalTrips: number;
  totalSold: number;
  totalRevenue: number;
}
interface ByTrip {
  title: string;
  revenue: number;
  seats: number;
}

export default function RevenuePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [byTrip, setByTrip] = useState<ByTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/trips/revenue')
      .then(({ data }) => {
        setStats(data.stats);
        setByTrip(data.byTrip);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-9 w-9" /></div>;

  const cards = [
    { label: 'Total Trips Added', value: stats?.totalTrips ?? 0, icon: Ticket },
    { label: 'Total Tickets Sold', value: stats?.totalSold ?? 0, icon: Armchair },
    { label: 'Total Revenue', value: formatBDT(stats?.totalRevenue ?? 0), icon: TrendingUp },
  ];

  return (
    <div id="revenue-page">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Revenue Overview</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label} className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/40">
              <c.icon size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">{c.label}</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{c.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {byTrip.length > 0 ? (
        <RevenueCharts byTrip={byTrip} />
      ) : (
        <p className="py-16 text-center text-slate-500">No sales data yet.</p>
      )}
    </div>
  );
}
