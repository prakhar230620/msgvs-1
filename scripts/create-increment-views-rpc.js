const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Use the same connection logic as previous script
const connectionString = process.env.POSTGRES_URL_NON_POOLING
    ? process.env.POSTGRES_URL_NON_POOLING.replace('?sslmode=require', '').replace('&sslmode=require', '')
    : process.env.DATABASE_URL; // Fallback

if (!connectionString) {
    console.error("No database connection string found.");
    process.exit(1);
}

const client = new Client({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

const sql = `
-- Create increment_blog_views function
create or replace function increment_blog_views(blog_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update blogs
  set views = coalesce(views, 0) + 1
  where id = blog_id;
end;
$$;

-- Grant execute permission to public (anon) and authenticated users
grant execute on function increment_blog_views(uuid) to anon, authenticated, service_role;
`;

async function run() {
    try {
        await client.connect();
        console.log('Connected to database');
        await client.query(sql);
        console.log('RPC function created successfully');
    } catch (err) {
        console.error('Error executing SQL:', err);
    } finally {
        await client.end();
    }
}

run();
