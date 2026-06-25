'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { apiError } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GoogleButton } from '@/components/auth/GoogleButton';

interface FormValues {
  name: string;
  email: string;
  password: string;
}

function RegisterForm() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/';
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await registerUser(values.name, values.email, values.password);
      toast.success('Account created!');
      router.push(redirect);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div
        id="register-card"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create account</h1>
        <p className="mt-1 text-sm text-slate-500">Join Jatri to book your seats.</p>

        <form id="register-form" onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input
            id="register-name"
            label="Name"
            placeholder="Your name"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Too short' } })}
          />
          <Input
            id="register-email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />
          <Input
            id="register-password"
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
          />
          <Button id="register-submit" type="submit" className="w-full" isLoading={loading}>
            Register
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs text-slate-400">OR</span>
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        <GoogleButton />

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-brand-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
