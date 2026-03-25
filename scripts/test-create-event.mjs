import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(connectionString);

const idRows = await sql.query(`select concat('evt-', coalesce(max(substring(id from 5)::int), 0) + 1) as id from events`);
const nextId = idRows[0]?.id;

await sql.query(
  `
    insert into events (
      id, title, description, event_date, event_time, location, address, price,
      capacity, tickets_sold, category, image_url, organizer_id, is_trending, is_verified, trust_score
    )
    values ($1, $2, $3, $4::date, $5, $6, $7, $8::numeric, $9::int, 0, $10, $11, $12, false, true, 85)
  `,
  [
    nextId,
    'Codex Test Event',
    'A verification event created during end-to-end testing.',
    '2026-09-12',
    '19:30',
    'Verification Hall',
    '100 Test Avenue, New York, NY 10001',
    '55',
    '150',
    'Tech',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    'org-1',
  ]
);

const rows = await sql.query(
  `
    select id, title
    from events
    where id = $1
    limit 1
  `,
  [nextId]
);

const countRows = await sql.query(`select count(*)::int as count from events`);

console.log(
  JSON.stringify(
    {
      createdId: rows[0]?.id,
      createdTitle: rows[0]?.title,
      foundInDatabase: Boolean(rows[0]),
      totalEvents: countRows[0]?.count,
    },
    null,
    2
  )
);
