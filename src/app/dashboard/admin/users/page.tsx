'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ShieldAlert, UserCog, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, apiError } from '@/lib/api';
import type { User, UserRole } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';

const roleTone: Record<UserRole, 'success' | 'info' | 'default'> = {
  admin: 'success',
  vendor: 'info',
  user: 'default',
};

interface VendorForm {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<VendorForm>();

  const load = () =>
    api.get('/users').then(({ data }) => setUsers(data.users)).catch(() => setUsers([])).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const setRole = async (id: string, role: UserRole) => {
    try {
      await api.patch(`/users/${id}/role`, { role });
      toast.success(`Role updated to ${role}`);
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const markFraud = async (id: string) => {
    if (!confirm('Mark this vendor as fraud? Their vehicles will be hidden and they cannot add trips.')) return;
    try {
      await api.patch(`/users/${id}/fraud`);
      toast.success('Vendor marked as fraud');
      load();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const createVendor = async (values: VendorForm) => {
    setCreating(true);
    try {
      await api.post('/users/vendors', values);
      toast.success('Vendor account created');
      reset();
      setOpen(false);
      load();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner className="h-9 w-9" /></div>;

  return (
    <div id="manage-users-page">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manage Users</h1>
        <Button id="create-vendor-btn" onClick={() => setOpen(true)}>
          <UserPlus size={16} /> Create Vendor
        </Button>
      </div>

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                  {u.name} {u.isFraud && <Badge tone="danger">Fraud</Badge>}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge tone={roleTone[u.role]} className="capitalize">{u.role}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {u.role !== 'admin' && (
                      <Button size="sm" variant="outline" onClick={() => setRole(u._id, 'admin')}>
                        <UserCog size={13} /> Make Admin
                      </Button>
                    )}
                    {u.role !== 'vendor' && (
                      <Button size="sm" variant="outline" onClick={() => setRole(u._id, 'vendor')}>
                        Make Vendor
                      </Button>
                    )}
                    {u.role === 'vendor' && !u.isFraud && (
                      <Button size="sm" variant="danger" onClick={() => markFraud(u._id)}>
                        <ShieldAlert size={13} /> Mark Fraud
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Vendor Account">
        <form onSubmit={handleSubmit(createVendor)} className="space-y-3">
          <Input id="vendor-name" label="Name" error={errors.name?.message}
            {...register('name', { required: 'Name is required' })} />
          <Input id="vendor-email" label="Email" type="email" error={errors.email?.message}
            {...register('email', { required: 'Email is required' })} />
          <Input id="vendor-password" label="Password" type="password" error={errors.password?.message}
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })} />
          <Input id="vendor-phone" label="Phone (optional)" {...register('phone')} />
          <Button type="submit" className="w-full" isLoading={creating}>
            Create Vendor
          </Button>
        </form>
      </Modal>
    </div>
  );
}
