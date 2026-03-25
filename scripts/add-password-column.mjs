import { neon } from '@neondatabase/serverless';
import crypto from 'node:crypto';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(connectionString);

const hashPassword = (password) => crypto.createHash('sha256').update(password).digest('hex');

await sql.query(`
  alter table app_users
  add column if not exists password_hash text
`);

await sql.query(
  `
    update app_users
    set password_hash = $2
    where id = $1 and (password_hash is null or password_hash = '')
  `,
  ['user-1', hashPassword('password123')]
);

console.log('Password column ensured and seeded for existing users.');
