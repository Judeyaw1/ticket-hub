import { getDatabaseStatus } from '../lib/db';

export default async function handler(_request: unknown, response: any) {
  try {
    const status = await getDatabaseStatus();

    response.status(200).json({
      ok: true,
      database: status.database_name,
      serverTime: status.server_time,
      serverVersion: status.server_version,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error';

    response.status(500).json({
      ok: false,
      error: message,
    });
  }
}
