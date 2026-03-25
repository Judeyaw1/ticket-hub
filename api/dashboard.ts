import { getUserDashboard } from '../lib/app-data.js';

export default async function handler(request: any, response: any) {
  try {
    const userId = request.query.userId || 'user-1';
    const data = await getUserDashboard(userId);
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : 'Failed to load dashboard' });
  }
}
