import { createEvent } from '../../lib/app-data.js';
import { readJsonBody } from '../../lib/read-json-body.js';

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readJsonBody(request);
    const event = await createEvent({
      ...body,
      organizerId: body.organizerId || 'org-1',
    });

    response.status(201).json({ event });
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : 'Failed to create event' });
  }
}
