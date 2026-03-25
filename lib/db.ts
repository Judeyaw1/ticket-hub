import { neon } from '@neondatabase/serverless';

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Add it in your local .env.local and in the Vercel project environment variables.');
  }

  return connectionString;
}

function getSqlClient() {
  return neon(getConnectionString());
}

export const sql = new Proxy(function () {}, {
  apply(_target, _thisArg, args) {
    return Reflect.apply(getSqlClient() as any, undefined, args);
  },
  get(_target, property) {
    return Reflect.get(getSqlClient() as any, property);
  },
}) as any;

export async function getDatabaseStatus() {
  const result = await sql`
    select
      current_database() as database_name,
      now() as server_time,
      version() as server_version
  `;

  return result[0];
}
