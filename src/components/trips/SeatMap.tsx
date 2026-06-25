'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { getSocket } from '@/lib/socket';
import { getGuestId } from '@/lib/guest';
import { cn } from '@/lib/utils';
import type { Seat, SeatLayout } from '@/lib/types';

interface SeatMapProps {
  tripId: string;
  seats: Seat[];
  layout: SeatLayout;
  disabled?: boolean;
  onSelectionChange: (selected: string[]) => void;
}

type StatusMap = Record<string, 'available' | 'held' | 'booked'>;

export function SeatMap({ tripId, seats, layout, disabled, onSelectionChange }: SeatMapProps) {
  const [statuses, setStatuses] = useState<StatusMap>({});
  const [selected, setSelected] = useState<string[]>([]);
  const holderId = useMemo(() => getGuestId(), []);

  // Build the seat number -> grid arrangement from layout, keeping the same labels the server generates.
  const grid = useMemo(() => {
    const list = seats.map((s) => s.seatNumber);
    const rows: string[][] = [];
    for (let r = 0; r < layout.rows; r++) {
      rows.push(list.slice(r * layout.columns, r * layout.columns + layout.columns));
    }
    return rows;
  }, [seats, layout]);

  useEffect(() => {
    const initial: StatusMap = {};
    seats.forEach((s) => (initial[s.seatNumber] = s.status));
    setStatuses(initial);
  }, [seats]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit('trip:join', tripId);

    const onLocked = (p: { seatNumber: string; holderId: string }) => {
      if (p.holderId === holderId) return;
      setStatuses((prev) => ({ ...prev, [p.seatNumber]: 'held' }));
    };
    const onReleased = (p: { seatNumbers: string[] }) => {
      setStatuses((prev) => {
        const next = { ...prev };
        p.seatNumbers.forEach((s) => (next[s] = 'available'));
        return next;
      });
    };
    const onBooked = (p: { seatNumbers: string[] }) => {
      setStatuses((prev) => {
        const next = { ...prev };
        p.seatNumbers.forEach((s) => (next[s] = 'booked'));
        return next;
      });
      setSelected((prev) => prev.filter((s) => !p.seatNumbers.includes(s)));
    };
    const onUnavailable = (p: { seatNumber: string; message: string }) => {
      toast.error(p.message);
      setStatuses((prev) => ({ ...prev, [p.seatNumber]: 'held' }));
      setSelected((prev) => prev.filter((s) => s !== p.seatNumber));
    };

    socket.on('seat:locked', onLocked);
    socket.on('seat:released', onReleased);
    socket.on('seat:booked', onBooked);
    socket.on('seat:unavailable', onUnavailable);

    return () => {
      socket.emit('trip:leave', tripId);
      socket.off('seat:locked', onLocked);
      socket.off('seat:released', onReleased);
      socket.off('seat:booked', onBooked);
      socket.off('seat:unavailable', onUnavailable);
    };
  }, [tripId, holderId]);

  useEffect(() => {
    onSelectionChange(selected);
  }, [selected, onSelectionChange]);

  const toggleSeat = (seatNumber: string) => {
    if (disabled) return;
    const socket = getSocket();
    const status = statuses[seatNumber];

    if (selected.includes(seatNumber)) {
      socket.emit('seat:deselect', { tripId, seatNumber, holderId });
      setSelected((prev) => prev.filter((s) => s !== seatNumber));
      setStatuses((prev) => ({ ...prev, [seatNumber]: 'available' }));
      return;
    }

    if (status === 'booked' || status === 'held') {
      toast.error(`Seat ${seatNumber} is not available.`);
      return;
    }

    socket.emit(
      'seat:select',
      { tripId, seatNumber, holderId },
      (res: { ok: boolean; message?: string }) => {
        if (res?.ok) {
          setSelected((prev) => [...prev, seatNumber]);
          setStatuses((prev) => ({ ...prev, [seatNumber]: 'held' }));
        } else {
          toast.error(res?.message || `Seat ${seatNumber} was just taken.`);
          setStatuses((prev) => ({ ...prev, [seatNumber]: 'held' }));
        }
      }
    );
  };

  const seatClass = (seatNumber: string) => {
    if (selected.includes(seatNumber)) return 'bg-brand-600 text-white border-brand-600';
    const status = statuses[seatNumber];
    if (status === 'booked') return 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-600';
    if (status === 'held') return 'bg-amber-400 text-white cursor-not-allowed';
    return 'bg-white text-slate-700 border-slate-300 hover:border-brand-500 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600';
  };

  return (
    <div id="seat-map">
      <div className="mb-4 flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400">
        <Legend className="border border-slate-300 bg-white dark:bg-slate-700" label="Available" />
        <Legend className="bg-brand-600" label="Selected" />
        <Legend className="bg-amber-400" label="Held" />
        <Legend className="bg-slate-300 dark:bg-slate-600" label="Booked" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto w-fit space-y-2">
          {grid.map((row, ri) => (
            <div key={ri} className="flex items-center gap-2">
              {row.map((seatNumber, ci) => (
                <div key={seatNumber} className="flex items-center gap-2">
                  <button
                    id={`seat-${seatNumber}`}
                    onClick={() => toggleSeat(seatNumber)}
                    disabled={disabled || statuses[seatNumber] === 'booked' || statuses[seatNumber] === 'held'}
                    className={cn(
                      'h-9 w-9 rounded-md border text-xs font-medium transition',
                      seatClass(seatNumber)
                    )}
                  >
                    {seatNumber}
                  </button>
                  {layout.aisleAfterColumn > 0 && ci === layout.aisleAfterColumn - 1 && <span className="w-4" />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('h-4 w-4 rounded', className)} /> {label}
    </span>
  );
}
