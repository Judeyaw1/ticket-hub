import { getUserProfile, updateUserProfile } from '../lib/app-data.js';
import { readJsonBody } from '../lib/read-json-body.js';

export default async function handler(request: any, response: any) {
  try {
    if (request.method === 'GET') {
      const userId = request.query.userId || 'user-1';
      const user = await getUserProfile(userId);
      response.status(200).json({ user });
      return;
    }

    if (request.method === 'PATCH') {
      const body = await readJsonBody(request);
      const user = await updateUserProfile({
        userId: body.userId || 'user-1',
        name: body.name,
        email: body.email,
        avatar: body.avatar,
      });
      response.status(200).json({ user });
      return;
    }

    response.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    response.status(400).json({ error: error instanceof Error ? error.message : 'Failed to load profile' });
  }
}
