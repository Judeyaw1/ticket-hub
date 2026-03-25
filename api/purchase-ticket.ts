import { purchaseTickets } from '../lib/app-data.js';
import { readJsonBody } from '../lib/read-json-body.js';

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readJsonBody(request);
    const tickets = await purchaseTickets({
      eventId: body.eventId,
      userId: body.userId || 'user-1',
      quantity: Number(body.quantity || 1),
    });

    response.status(201).json({ tickets });
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : 'Failed to purchase tickets' });
  }
}
