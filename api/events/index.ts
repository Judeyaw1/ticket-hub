import { getEvents } from '../../lib/app-data.js';

export default async function handler(_request: any, response: any) {
  try {
    const data = await getEvents();
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : 'Failed to load events' });
  }
}
