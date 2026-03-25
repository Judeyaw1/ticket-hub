import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set.');
}

export const sql = neon(connectionString);

export async function getDatabaseStatus() {
  const result = await sql`
    select
      current_database() as database_name,
      now() as server_time,
      version() as server_version
  `;

  return result[0];
}
