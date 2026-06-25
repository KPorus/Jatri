// BetterAuth server instance for Google login.
// Only initialized when Google credentials are configured so the app still runs without them.
import { betterAuth } from 'better-auth';
import { MongoClient } from 'mongodb';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';

const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

function buildAuth() {
  const uri = process.env.MONGODB_URI || process.env.NEXT_MONGODB_URI;
  if (!uri || !googleConfigured) return null;
  const client = new MongoClient(uri);
  const db = client.db();
  return betterAuth({
    database: mongodbAdapter(db),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
  });
}

export const auth = buildAuth();
