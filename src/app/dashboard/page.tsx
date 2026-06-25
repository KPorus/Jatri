'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PageLoader } from '@/components/ui/Spinner';

export default function DashboardIndex() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;
    if (user.role === 'admin') router.replace('/dashboard/admin/users');
    else if (user.role === 'vendor') router.replace('/dashboard/vendor/trips');
    else router.replace('/dashboard/my-bookings');
  }, [user, loading, router]);

  return <PageLoader />;
}
