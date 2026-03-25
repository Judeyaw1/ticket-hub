import { getUserTickets } from '../lib/app-data';

export default async function handler(request: any, response: any) {
  try {
    const userId = request.query.userId || 'user-1';
    const tickets = await getUserTickets(userId);
    response.status(200).json({ tickets });
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : 'Failed to load tickets' });
  }
}
