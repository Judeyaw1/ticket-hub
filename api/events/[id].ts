import { getEventById } from '../../lib/app-data.js';

export default async function handler(request: any, response: any) {
  try {
    const { id } = request.query;
    const event = await getEventById(id);

    if (!event) {
      response.status(404).json({ error: 'Event not found' });
      return;
    }

    response.status(200).json(event);
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : 'Failed to load event' });
  }
}
