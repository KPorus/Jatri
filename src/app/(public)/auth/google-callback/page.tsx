'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { useAuth } from '@/context/AuthContext';
import { PageLoader } from '@/components/ui/Spinner';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { googleLogin } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      try {
        const session = (await authClient.getSession()) as { data?: { user?: { id: string; email?: string; name?: string; image?: string } } };
        const u = session.data?.user;
        if (!u?.email) throw new Error('No Google session');
        await googleLogin({
          email: u.email,
          name: u.name || u.email,
          googleId: u.id,
          avatar: u.image || undefined,
        });
        toast.success('Logged in with Google');
        router.push('/dashboard');
      } catch {
        toast.error('Google login failed');
        router.push('/login');
      }
    })();
  }, [googleLogin, router]);

  return <PageLoader />;
}
