import { auth } from '@/lib/auth';

// BetterAuth catch-all handler. Returns 503 when Google is not configured.
async function handler(req: Request): Promise<Response> {
  if (!auth) {
    return new Response(JSON.stringify({ error: 'Google login is not configured' }), {
      status: 503,
      headers: { 'content-type': 'application/json' },
    });
  }
  return auth.handler(req);
}

export { handler as GET, handler as POST };
