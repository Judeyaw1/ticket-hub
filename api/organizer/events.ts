import { createEvent } from '../../lib/app-data';

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const event = await createEvent({
      ...request.body,
      organizerId: request.body.organizerId || 'org-1',
    });

    response.status(201).json({ event });
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : 'Failed to create event' });
  }
}
