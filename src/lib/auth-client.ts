'use client';

import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',
});

export async function signInWithGoogle(): Promise<void> {
  await authClient.signIn.social({ provider: 'google', callbackURL: '/auth/google-callback' });
}
