import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const sql = neon(connectionString);

const tables = await sql.query(`
  select table_schema, table_name
  from information_schema.tables
  where table_schema <> 'pg_catalog'
    and table_schema <> 'information_schema'
  order by table_schema, table_name
`);

const columns = await sql.query(`
  select table_schema, table_name, column_name, data_type
  from information_schema.columns
  where table_schema <> 'pg_catalog'
    and table_schema <> 'information_schema'
  order by table_schema, table_name, ordinal_position
`);

console.log(JSON.stringify({ tables, columns }, null, 2));
