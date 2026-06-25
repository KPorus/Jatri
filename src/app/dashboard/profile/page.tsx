'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Phone, ShieldCheck } from 'lucide-react';
import { api, apiError } from '@/lib/api';
import { uploadImage } from '@/lib/upload';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!user) return null;

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setAvatar(url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch('/users/me', { name, phone, avatar });
      setUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="profile-page" className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>

      <Card className="mt-6 p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=120`}
            alt={user.name}
            className="h-28 w-28 rounded-full object-cover ring-4 ring-brand-100 dark:ring-brand-900/40"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{user.name}</h2>
              <Badge tone="success" className="capitalize">{user.role}</Badge>
            </div>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-slate-500 sm:justify-start">
              <Mail size={14} /> {user.email}
            </p>
            {user.phone && (
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-slate-500 sm:justify-start">
                <Phone size={14} /> {user.phone}
              </p>
            )}
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-slate-500 sm:justify-start">
              <ShieldCheck size={14} /> Signed in via {user.provider || 'local'}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input id="profile-name" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input id="profile-phone" label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <div className="sm:col-span-2">
            <label htmlFor="profile-avatar" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Profile picture
            </label>
            <input
              id="profile-avatar"
              type="file"
              accept="image/*"
              onChange={onUpload}
              className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700"
            />
            {uploading && <p className="mt-1 text-xs text-slate-400">Uploading...</p>}
          </div>
        </div>

        <Button id="save-profile" className="mt-6" onClick={save} isLoading={saving}>
          Save changes
        </Button>
      </Card>
    </div>
  );
}
