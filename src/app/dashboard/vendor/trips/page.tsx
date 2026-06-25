'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, ArrowRight, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, apiError } from '@/lib/api';
import type { Trip } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { formatBDT, formatDateTime } from '@/lib/utils';

export default function VendorTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Trip | null>(null);
  const [form, setForm] = useState({ title: '', from: '', to: '', pricePerSeat: 0, departureAt: '' });
  const [saving, setSaving] = useState(false);

  const load = () =>
    api.get('/trips/mine').then(({ data }) => setTrips(data.trips)).catch(() => setTrips([])).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const openEdit = (t: Trip) => {
    setEditing(t);
    setForm({
      title: t.title,
      from: t.from,
      to: t.to,
      pricePerSeat: t.pricePerSeat,
      departureAt: new Date(t.departureAt).toISOString().slice(0, 16),
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await api.patch(`/trips/${editing._id}`, {
        title: form.title,
        from: form.from,
        to: form.to,
        pricePerSeat: Number(form.pricePerSeat),
        departureAt: new Date(form.departureAt).toISOString(),
      });
      toast.success('Trip updated');
      setEditing(null);
      load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (t: Trip) => {
    if (!confirm('Delete this trip? This cannot be undone.')) return;
    try {
      await api.delete(`/trips/${t._id}`);
      toast.success('Trip deleted');
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-9 w-9" /></div>;

  return (
    <div id="vendor-trips-page">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Trips</h1>
        <Link
          href="/dashboard/vendor/add-trip"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          <PlusCircle size={16} /> Add Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <p className="py-16 text-center text-slate-500">No trips yet. Add your first trip.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((t) => (
            <Card key={t._id} className="overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.images?.[0]} alt={t.title} className="h-32 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="line-clamp-1 font-semibold text-slate-900 dark:text-white">{t.title}</h3>
                  {t.isAdvertised && <Badge tone="success">Advertised</Badge>}
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                  {t.from} <ArrowRight size={13} /> {t.to}
                </p>
                <p className="mt-1 text-sm text-slate-500">{formatDateTime(t.departureAt)}</p>
                <p className="mt-1 font-semibold text-brand-600 dark:text-brand-400">{formatBDT(t.pricePerSeat)} / seat</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(t)}>
                    <Pencil size={14} /> Update
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => remove(t)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Update Trip">
        <div className="space-y-3">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="From" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
            <Input label="To" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
          </div>
          <Input
            label="Price per seat"
            type="number"
            value={form.pricePerSeat}
            onChange={(e) => setForm({ ...form, pricePerSeat: Number(e.target.value) })}
          />
          <Input
            label="Departure"
            type="datetime-local"
            value={form.departureAt}
            onChange={(e) => setForm({ ...form, departureAt: e.target.value })}
          />
          <Button className="w-full" onClick={saveEdit} isLoading={saving}>
            Save changes
          </Button>
        </div>
      </Modal>
    </div>
  );
}
