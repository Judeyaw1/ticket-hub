import { purchaseTickets } from '../lib/app-data';

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const tickets = await purchaseTickets({
      eventId: request.body.eventId,
      userId: request.body.userId || 'user-1',
      quantity: Number(request.body.quantity || 1),
    });

    response.status(201).json({ tickets });
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : 'Failed to purchase tickets' });
  }
}
