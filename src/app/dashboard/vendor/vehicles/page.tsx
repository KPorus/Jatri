'use client';

import { useEffect, useState } from 'react';
import { Bus, Armchair } from 'lucide-react';
import { api } from '@/lib/api';
import type { Vehicle } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';

export default function VendorVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/vehicles/mine')
      .then(({ data }) => setVehicles(data.vehicles))
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-9 w-9" /></div>;

  return (
    <div id="vendor-vehicles-page">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Vehicles</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Vehicles assigned to you by the admin.</p>

      {vehicles.length === 0 ? (
        <p className="py-16 text-center text-slate-500">No vehicles assigned yet. Contact the admin.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <Card key={v._id} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/40">
                  <Bus size={20} />
                </div>
                <Badge tone="info" className="capitalize">{v.type}</Badge>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{v.name}</h3>
              <p className="text-sm text-slate-500">{v.operator}</p>
              <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                <Armchair size={15} className="text-brand-500" /> {v.seatLayout.totalSeats} seats ({v.seatLayout.rows}x
                {v.seatLayout.columns})
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
