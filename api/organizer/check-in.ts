import { checkInTicket } from '../../lib/app-data.js';
import { readJsonBody } from '../../lib/read-json-body.js';

export default async function handler(request: any, response: any) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readJsonBody(request);
    const result = await checkInTicket({
      organizerId: body.organizerId,
      eventId: body.eventId,
      qrCode: body.qrCode,
    });

    response.status(200).json(result);
  } catch (error) {
    response.status(400).json({ error: error instanceof Error ? error.message : 'Failed to check in ticket' });
  }
}
