const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const client = new Client({
    connectionString: process.env.POSTGRES_URL_NON_POOLING.replace('?sslmode=require', '').replace('&sslmode=require', ''),
    ssl: {
        rejectUnauthorized: false,
    },
});

const sql = `
-- Create notifications table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  message text not null,
  type text check (type in ('info', 'success', 'warning', 'error')) default 'info',
  read boolean default false,
  link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.notifications enable row level security;

-- Create policies (drop if exists to avoid error)
drop policy if exists "Allow read access for authenticated users" on public.notifications;
create policy "Allow read access for authenticated users"
  on public.notifications for select
  to authenticated
  using (true);

drop policy if exists "Allow update access for authenticated users" on public.notifications;
create policy "Allow update access for authenticated users"
  on public.notifications for update
  to authenticated
  using (true);

-- Insert sample data
insert into public.notifications (title, message, type, read, link)
values
  ('Welcome to Admin Panel', 'You have successfully logged in.', 'success', false, null),
  ('New Subscriber', 'john@example.com has subscribed.', 'info', false, '/admin/newsletter');
`;

async function run() {
    try {
        await client.connect();
        console.log('Connected to database');
        await client.query(sql);
        console.log('SQL executed successfully');
    } catch (err) {
        console.error('Error executing SQL:', err);
    } finally {
        await client.end();
    }
}

run();
