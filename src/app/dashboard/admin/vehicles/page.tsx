'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Bus, Trash2, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, apiError } from '@/lib/api';
import type { User, Vehicle } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';

interface VehicleForm {
  type: string;
  name: string;
  operator: string;
  registrationNo?: string;
  rows: number;
  columns: number;
  aisleAfterColumn: number;
  assignedVendor?: string;
}

export default function ManageVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vendors, setVendors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<VehicleForm>({
    defaultValues: { rows: 10, columns: 4, aisleAfterColumn: 2, type: 'bus' },
  });

  const load = () =>
    Promise.all([api.get('/vehicles'), api.get('/users/vendors')])
      .then(([vRes, venRes]) => {
        setVehicles(vRes.data.vehicles);
        setVendors(venRes.data.vendors);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const create = async (values: VehicleForm) => {
    setSaving(true);
    try {
      await api.post('/vehicles', {
        type: values.type,
        name: values.name,
        operator: values.operator,
        registrationNo: values.registrationNo,
        seatLayout: {
          rows: Number(values.rows),
          columns: Number(values.columns),
          aisleAfterColumn: Number(values.aisleAfterColumn),
          labelStyle: 'alpha-row',
        },
        assignedVendor: values.assignedVendor || null,
      });
      toast.success('Vehicle created');
      reset();
      setOpen(false);
      load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const assign = async (id: string, vendorId: string) => {
    try {
      await api.patch(`/vehicles/${id}/assign`, { vendorId: vendorId || null });
      toast.success('Assignment updated');
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this vehicle?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      toast.success('Vehicle deleted');
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-9 w-9" /></div>;

  return (
    <div id="manage-vehicles-page">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Vehicles</h1>
        <Button onClick={() => setOpen(true)}>
          <PlusCircle size={16} /> Add Vehicle
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <p className="py-16 text-center text-slate-500">No vehicles yet. Create one to assign to a vendor.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => {
            const assignedId = typeof v.assignedVendor === 'object' && v.assignedVendor ? v.assignedVendor._id : '';
            return (
              <Card key={v._id} className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/40">
                    <Bus size={20} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="info" className="capitalize">{v.type}</Badge>
                    {!v.isActive && <Badge tone="danger">Hidden</Badge>}
                  </div>
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{v.name}</h3>
                <p className="text-sm text-slate-500">
                  {v.operator} - {v.seatLayout.totalSeats} seats
                </p>
                <div className="mt-3">
                  <label className="mb-1 block text-xs font-medium text-slate-500">Assigned vendor</label>
                  <Select value={assignedId} onChange={(e) => assign(v._id, e.target.value)}>
                    <option value="">Unassigned</option>
                    {vendors.map((ven) => (
                      <option key={ven._id} value={ven._id}>
                        {ven.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <Button variant="danger" size="sm" className="mt-3 w-full" onClick={() => remove(v._id)}>
                  <Trash2 size={14} /> Delete
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add Vehicle" className="max-w-lg">
        <form onSubmit={handleSubmit(create)} className="grid grid-cols-2 gap-3">
          <Select id="vehicle-type" label="Type" {...register('type', { required: true })}>
            <option value="bus">Bus</option>
            <option value="train">Train</option>
            <option value="launch">Launch</option>
            <option value="plane">Plane</option>
          </Select>
          <Input id="vehicle-name" label="Name" error={errors.name?.message}
            {...register('name', { required: 'Required' })} />
          <Input id="vehicle-operator" label="Operator" error={errors.operator?.message}
            {...register('operator', { required: 'Required' })} />
          <Input id="vehicle-reg" label="Registration No" {...register('registrationNo')} />
          <Input id="vehicle-rows" label="Rows" type="number" min={1}
            {...register('rows', { required: true, valueAsNumber: true })} />
          <Input id="vehicle-cols" label="Columns" type="number" min={1}
            {...register('columns', { required: true, valueAsNumber: true })} />
          <Input id="vehicle-aisle" label="Aisle after column" type="number" min={0}
            {...register('aisleAfterColumn', { valueAsNumber: true })} />
          <Select id="vehicle-vendor" label="Assign vendor" {...register('assignedVendor')}>
            <option value="">Unassigned</option>
            {vendors.map((ven) => (
              <option key={ven._id} value={ven._id}>
                {ven.name}
              </option>
            ))}
          </Select>
          <div className="col-span-2">
            <Button type="submit" className="w-full" isLoading={saving}>
              Create Vehicle
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
