import { signupUser } from '../../lib/app-data';
import { readJsonBody } from '../../lib/read-json-body';

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
    response.status(400).json({ error: error instanceof Error ? error.message : 'Failed to sign up' });
  }
}
