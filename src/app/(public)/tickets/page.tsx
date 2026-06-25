'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { api } from '@/lib/api';
import type { Trip, Pagination } from '@/lib/types';
import { TripCard } from '@/components/trips/TripCard';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

function TicketsContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [from, setFrom] = useState(params.get('from') || '');
  const [to, setTo] = useState(params.get('to') || '');
  const [type, setType] = useState(params.get('type') || '');
  const [sort, setSort] = useState(params.get('sort') || '');
  const [page, setPage] = useState(parseInt(params.get('page') || '1', 10));

  const [trips, setTrips] = useState<Trip[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/trips', {
        params: { from, to, type, sort, page, limit: 9 },
      });
      setTrips(data.trips);
      setPagination(data.pagination);
    } catch {
      setTrips([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, type, sort, page]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const applyFilters = (e?: React.FormEvent) => {
    e?.preventDefault();
    setPage(1);
    const q = new URLSearchParams();
    if (from) q.set('from', from);
    if (to) q.set('to', to);
    if (type) q.set('type', type);
    if (sort) q.set('sort', sort);
    router.replace(`/tickets?${q.toString()}`);
    fetchTrips();
  };

  return (
    <div className="container-page py-10">
      <h1 className="section-heading">All Tickets</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Search, filter and sort available trips.</p>

      <form
        id="ticket-filters"
        onSubmit={applyFilters}
        className="mt-6 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5 dark:border-slate-700 dark:bg-slate-800"
      >
        <Input id="filter-from" label="From" placeholder="Dhaka" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Input id="filter-to" label="To" placeholder="Sylhet" value={to} onChange={(e) => setTo(e.target.value)} />
        <Select id="filter-type" label="Transport type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          <option value="bus">Bus</option>
          <option value="train">Train</option>
          <option value="launch">Launch</option>
          <option value="plane">Plane</option>
        </Select>
        <Select id="filter-sort" label="Sort by price" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </Select>
        <div className="flex items-end">
          <Button id="apply-filters" type="submit" className="w-full">
            <SlidersHorizontal size={16} /> Apply
          </Button>
        </div>
      </form>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner className="h-9 w-9" /></div>
      ) : trips.length === 0 ? (
        <p className="py-20 text-center text-slate-500">No tickets found for your search.</p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((t) => (
              <TripCard key={t._id} trip={t} />
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div id="pagination" className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 w-9 rounded-lg text-sm font-medium ${
                    page === i + 1
                      ? 'bg-brand-600 text-white'
                      : 'border border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function TicketsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner className="h-9 w-9" /></div>}>
      <TicketsContent />
    </Suspense>
  );
}
