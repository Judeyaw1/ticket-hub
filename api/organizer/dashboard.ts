import { getOrganizerDashboard } from '../../lib/app-data.js';

export default async function handler(request: any, response: any) {
  try {
    const organizerId = request.query.organizerId || 'org-1';
    const data = await getOrganizerDashboard(organizerId);
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : 'Failed to load organizer dashboard' });
  }
}
