'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowRight, MapPin } from 'lucide-react';
import { api, apiError } from '@/lib/api';
import { getGuestId } from '@/lib/guest';
import type { Booking } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Countdown } from '@/components/trips/Countdown';
import { formatBDT, formatDateTime } from '@/lib/utils';

const statusTone: Record<string, 'warning' | 'success' | 'danger' | 'default'> = {
  pending: 'warning',
  paid: 'success',
  expired: 'danger',
  cancelled: 'default',
};

function BookingsContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/bookings/mine');
      setBookings(data.bookings);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Confirm payment when returning from Stripe (fallback to webhook).
    const sessionId = params.get('session_id');
    const payment = params.get('payment');
    if (payment === 'success' && sessionId) {
      api
        .post('/bookings/confirm', { sessionId })
        .then(() => toast.success('Payment successful! Your seats are booked.'))
        .catch(() => undefined)
        .finally(() => {
          router.replace('/dashboard/my-bookings');
          load();
        });
    } else if (payment === 'cancelled') {
      toast('Payment cancelled.');
      router.replace('/dashboard/my-bookings');
      load();
    } else {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const payNow = async (b: Booking) => {
    setBusy(b._id);
    try {
      const { data } = await api.post('/bookings/checkout', {
        tripId: b.trip._id,
        seatNumbers: b.seatNumbers,
        guestId: getGuestId(),
      });
      if (data.url) window.location.href = data.url;
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setBusy(null);
    }
  };

  const cancel = async (b: Booking) => {
    setBusy(b._id);
    try {
      await api.patch(`/bookings/${b._id}/cancel`);
      toast.success('Booking cancelled');
      load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-9 w-9" /></div>;

  return (
    <div id="my-bookings-page">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Booked Tickets</h1>

      {bookings.length === 0 ? (
        <p className="py-16 text-center text-slate-500">You have no bookings yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {bookings.map((b) => {
            const departed = new Date(b.trip.departureAt).getTime() <= Date.now();
            const holdActive = b.status === 'pending' && new Date(b.holdExpiresAt).getTime() > Date.now();
            return (
              <Card key={b._id} id={`booking-${b._id}`} className="overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.trip.images?.[0]} alt={b.trip.title} className="h-36 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="line-clamp-1 font-semibold text-slate-900 dark:text-white">{b.trip.title}</h3>
                    <Badge tone={statusTone[b.status]} className="capitalize">{b.status}</Badge>
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin size={14} className="text-brand-500" />
                    {b.trip.from} <ArrowRight size={13} /> {b.trip.to}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Departure: {formatDateTime(b.trip.departureAt)}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Seats: <span className="font-medium">{b.seatNumbers.join(', ')}</span>
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-brand-600 dark:text-brand-400">{formatBDT(b.totalPrice)}</span>
                    {!departed && b.status !== 'expired' && b.status !== 'cancelled' && (
                      <span className="text-xs text-slate-500">
                        Departs in <Countdown target={b.trip.departureAt} id={`bk-cd-${b._id}`} />
                      </span>
                    )}
                  </div>

                  {b.status === 'pending' && (
                    <div className="mt-4 flex gap-2">
                      <Button
                        className="flex-1"
                        size="sm"
                        disabled={departed || !holdActive}
                        isLoading={busy === b._id}
                        onClick={() => payNow(b)}
                      >
                        {departed ? 'Departed' : holdActive ? 'Pay Now' : 'Hold expired'}
                      </Button>
                      <Button variant="outline" size="sm" disabled={busy === b._id} onClick={() => cancel(b)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner className="h-9 w-9" /></div>}>
      <BookingsContent />
    </Suspense>
  );
}
