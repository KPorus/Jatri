'use client';

import { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, apiError } from '@/lib/api';
import type { Trip } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { formatDateTime } from '@/lib/utils';

export default function AdvertisePage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    api.get('/trips/all').then(({ data }) => setTrips(data.trips)).catch(() => setTrips([])).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const advertisedCount = trips.filter((t) => t.isAdvertised).length;

  const toggle = async (t: Trip) => {
    try {
      await api.patch(`/trips/${t._id}/advertise`);
      toast.success(t.isAdvertised ? 'Removed from advertisements' : 'Added to advertisements');
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-9 w-9" /></div>;

  return (
    <div id="advertise-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Advertise Tickets</h1>
          <p className="mt-1 text-sm text-slate-500">Up to 6 trips appear in the homepage featured section.</p>
        </div>
        <Badge tone={advertisedCount >= 6 ? 'danger' : 'info'}>{advertisedCount} / 6 advertised</Badge>
      </div>

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Route</th>
              <th className="px-4 py-3 font-medium">Departure</th>
              <th className="px-4 py-3 font-medium">Advertise</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((t) => (
              <tr key={t._id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{t.title}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {t.from} &rarr; {t.to}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDateTime(t.departureAt)}</td>
                <td className="px-4 py-3">
                  <button
                    id={`advertise-toggle-${t._id}`}
                    onClick={() => toggle(t)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      t.isAdvertised ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        t.isAdvertised ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {trips.length === 0 && (
        <div className="flex flex-col items-center py-16 text-slate-500">
          <Megaphone className="mb-2 h-10 w-10" />
          No trips available to advertise.
        </div>
      )}
    </div>
  );
}
