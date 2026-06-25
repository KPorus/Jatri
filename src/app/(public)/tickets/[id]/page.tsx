'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, MapPin, Clock, Bus, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, apiError } from '@/lib/api';
import { getGuestId } from '@/lib/guest';
import { useAuth } from '@/context/AuthContext';
import type { Trip, Seat, Vehicle } from '@/lib/types';
import { formatBDT, formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Spinner';
import { Countdown } from '@/components/trips/Countdown';

const SeatMap = dynamic(() => import('@/components/trips/SeatMap').then((m) => m.SeatMap), {
  ssr: false,
  loading: () => <div className="h-72 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />,
});

export default function TripDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    api
      .get(`/trips/${id}`)
      .then(({ data }) => {
        setTrip(data.trip);
        setSeats(data.seats);
      })
      .catch(() => toast.error('Trip not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSelection = useCallback((s: string[]) => setSelected(s), []);

  const departed = trip ? new Date(trip.departureAt).getTime() <= Date.now() : false;
  const vehicle = trip?.vehicle as Vehicle | undefined;

  const proceed = async () => {
    if (selected.length === 0) {
      toast.error('Please select at least one seat.');
      return;
    }
    // Login is only required at this final payment step. Seats are already held via socket.
    if (!user) {
      toast('Please login to complete your booking.');
      router.push(`/login?redirect=/tickets/${id}`);
      return;
    }
    setPaying(true);
    try {
      const { data } = await api.post('/bookings/checkout', {
        tripId: id,
        seatNumbers: selected,
        guestId: getGuestId(),
      });
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Could not start checkout.');
      }
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!trip) return <div className="container-page py-20 text-center text-slate-500">Trip not found.</div>;

  const total = trip.pricePerSeat * selected.length;

  return (
    <div className="container-page py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={trip.images?.[0]} alt={trip.title} className="h-64 w-full object-cover sm:h-80" />
          </div>

          <div className="mt-6">
            <Badge tone="info" className="capitalize">{trip.transportType}</Badge>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{trip.title}</h1>

            <div className="mt-4 flex flex-wrap gap-6 text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-2">
                <MapPin size={18} className="text-brand-500" />
                {trip.from} <ArrowRight size={16} /> {trip.to}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={18} className="text-brand-500" /> {formatDateTime(trip.departureAt)}
              </span>
              {vehicle && (
                <span className="flex items-center gap-2">
                  <Bus size={18} className="text-brand-500" /> {vehicle.name} ({vehicle.operator})
                </span>
              )}
            </div>

            <div className="mt-4 rounded-lg bg-slate-100 px-4 py-3 text-sm dark:bg-slate-800">
              Departure countdown:{' '}
              <span className="font-semibold">
                <Countdown target={trip.departureAt} />
              </span>
            </div>

            {trip.perks?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-slate-900 dark:text-white">Perks</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {trip.perks.map((p) => (
                    <span
                      key={p}
                      className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-sm text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                    >
                      <CheckCircle2 size={14} /> {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Select your seats</h3>
              {departed ? (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20">
                  This trip has already departed. Booking is closed.
                </p>
              ) : vehicle?.seatLayout ? (
                <SeatMap
                  tripId={trip._id}
                  seats={seats}
                  layout={vehicle.seatLayout}
                  disabled={departed}
                  onSelectionChange={handleSelection}
                />
              ) : null}
            </div>
          </div>
        </div>

        {/* Booking summary */}
        <div className="lg:col-span-1">
          <div
            id="booking-summary"
            className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Booking Summary</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Price per seat</span>
                <span className="font-medium">{formatBDT(trip.pricePerSeat)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Selected seats</span>
                <span className="font-medium">{selected.length > 0 ? selected.join(', ') : '-'}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
                <span>Total</span>
                <span className="text-brand-600 dark:text-brand-400">{formatBDT(total)}</span>
              </div>
            </div>

            <Button
              id="book-now-btn"
              className="mt-5 w-full"
              size="lg"
              disabled={departed || selected.length === 0}
              isLoading={paying}
              onClick={proceed}
            >
              {departed ? 'Departed' : user ? 'Proceed to Pay' : 'Book Now'}
            </Button>
            {!user && !departed && (
              <p className="mt-3 text-center text-xs text-slate-500">
                You can pick seats now - login is only needed to pay. Your seat is held for 5 minutes.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
