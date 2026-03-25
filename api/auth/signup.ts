import { signupUser } from '../../lib/app-data.js';
import { readJsonBody } from '../../lib/read-json-body.js';

function formatAuthError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Failed to sign up';

  if (message.includes('DATABASE_URL')) {
    return {
      status: 500,
      error: 'Server database configuration is missing. Set DATABASE_URL in Vercel project settings.',
    };
  }

  if (message.includes('password_hash') || message.includes('app_users')) {
    return {
      status: 500,
      error: 'Database schema is incomplete for auth. Ensure the app_users table exists and includes password_hash.',
    };
  }

  if (message.includes('already exists')) {
    return {
      status: 400,
      error: message,
    };
  }

  return {
    status: 500,
    error: message,
  };
}

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readJsonBody(request);
    const user = await signupUser({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    response.status(201).json({ user });
  } catch (error) {
    const formatted = formatAuthError(error);
    response.status(formatted.status).json({ error: formatted.error });
  }
}
