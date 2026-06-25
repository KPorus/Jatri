'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { api, apiError } from '@/lib/api';
import { uploadImage } from '@/lib/upload';
import { useAuth } from '@/context/AuthContext';
import type { Vehicle } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

const PERKS = ['AC', 'WiFi', 'Breakfast', 'Charging Port', 'Blanket', 'Snacks', 'TV', 'Water'];

interface FormValues {
  title: string;
  vehicle: string;
  from: string;
  to: string;
  departureAt: string;
  arrivalAt: string;
  pricePerSeat: number;
}

export default function AddTripPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [perks, setPerks] = useState<string[]>([]);
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    api.get('/vehicles/mine').then(({ data }) => setVehicles(data.vehicles)).catch(() => undefined);
  }, []);

  const togglePerk = (p: string) =>
    setPerks((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setImage(await uploadImage(file));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!values.vehicle) {
      toast.error('Please select a vehicle');
      return;
    }
    setLoading(true);
    try {
      await api.post('/trips', {
        title: values.title,
        vehicle: values.vehicle,
        from: values.from,
        to: values.to,
        departureAt: new Date(values.departureAt).toISOString(),
        arrivalAt: values.arrivalAt ? new Date(values.arrivalAt).toISOString() : undefined,
        pricePerSeat: Number(values.pricePerSeat),
        perks,
        images: image ? [image] : [],
      });
      toast.success('Trip added');
      router.push('/dashboard/vendor/trips');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="add-trip-page" className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add Trip</h1>

      <Card className="mt-6 p-6">
        <form id="add-trip-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input id="trip-title" label="Trip title" placeholder="GreenLine Dhaka to Sylhet"
              error={errors.title?.message} {...register('title', { required: 'Title is required' })} />
          </div>
          <Select id="trip-vehicle" label="Vehicle" {...register('vehicle', { required: true })}>
            <option value="">Select a vehicle</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name} - {v.type} ({v.seatLayout.totalSeats} seats)
              </option>
            ))}
          </Select>
          <Input id="trip-price" label="Price per seat (BDT)" type="number" min={0}
            error={errors.pricePerSeat?.message} {...register('pricePerSeat', { required: 'Price is required' })} />
          <Input id="trip-from" label="From" placeholder="Dhaka"
            error={errors.from?.message} {...register('from', { required: 'From is required' })} />
          <Input id="trip-to" label="To" placeholder="Sylhet"
            error={errors.to?.message} {...register('to', { required: 'To is required' })} />
          <Input id="trip-departure" label="Departure date & time" type="datetime-local"
            error={errors.departureAt?.message} {...register('departureAt', { required: 'Departure is required' })} />
          <Input id="trip-arrival" label="Arrival date & time (optional)" type="datetime-local"
            {...register('arrivalAt')} />

          <div className="sm:col-span-2">
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Perks</p>
            <div className="flex flex-wrap gap-2">
              {PERKS.map((p) => (
                <button
                  type="button"
                  key={p}
                  id={`perk-${p}`}
                  onClick={() => togglePerk(p)}
                  className={`rounded-lg border px-3 py-1.5 text-sm ${
                    perks.includes(p)
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="trip-image" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Trip image
            </label>
            <input id="trip-image" type="file" accept="image/*" onChange={onUpload}
              className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700" />
            {uploading && <p className="mt-1 text-xs text-slate-400">Uploading...</p>}
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="preview" className="mt-3 h-32 rounded-lg object-cover" />
            )}
          </div>

          <div className="sm:col-span-2 grid grid-cols-2 gap-3">
            <Input label="Vendor name" value={user?.name || ''} readOnly className="bg-slate-50 dark:bg-slate-900" />
            <Input label="Vendor email" value={user?.email || ''} readOnly className="bg-slate-50 dark:bg-slate-900" />
          </div>

          <div className="sm:col-span-2">
            <Button id="submit-trip" type="submit" isLoading={loading} className="w-full sm:w-auto">
              Add Ticket
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
