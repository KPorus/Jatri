'use client';

import Link from 'next/link';
import { ArrowRight, MapPin, Clock, Armchair } from 'lucide-react';
import type { Trip } from '@/lib/types';
import { formatBDT, formatDateTime, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

const typeTone: Record<string, 'info' | 'success' | 'warning' | 'default'> = {
  bus: 'info',
  train: 'success',
  launch: 'warning',
  plane: 'default',
};

export function TripCard({ trip }: { trip: Trip }) {
  const fallback = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80';
  return (
    <div
      id={`trip-card-${trip._id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="relative h-44 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={trip.images?.[0] || fallback}
          alt={trip.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <Badge tone={typeTone[trip.transportType]} className="absolute left-3 top-3 capitalize">
          {trip.transportType}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-slate-900 dark:text-white">{trip.title}</h3>
        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
          <MapPin size={14} className="text-brand-500" />
          <span className="font-medium">{trip.from}</span>
          <ArrowRight size={14} />
          <span className="font-medium">{trip.to}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
          <Clock size={14} className="text-brand-500" />
          {formatDateTime(trip.departureAt)}
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
          <Armchair size={14} className="text-brand-500" />
          {trip.totalSeats} seats
        </div>
        {trip.perks?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {trip.perks.slice(0, 3).map((p) => (
              <span
                key={p}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300"
              >
                {p}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center justify-between pt-4">
          <div>
            <span className="text-lg font-bold text-brand-600 dark:text-brand-400">{formatBDT(trip.pricePerSeat)}</span>
            <span className="text-xs text-slate-500"> / seat</span>
          </div>
          <Link
            id={`see-details-${trip._id}`}
            href={`/tickets/${trip._id}`}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700'
            )}
          >
            See details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
