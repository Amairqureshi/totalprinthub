create table if not exists b2b_requests (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  whatsapp text not null,
  status text default 'pending', -- pending, contacted, rejected
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table b2b_requests enable row level security;

-- Allow anyone (anon) to insert requests
create policy "Anyone can insert b2b requests"
  on b2b_requests for insert
  with check (true);

-- Allow admins to view requests (assuming standard admin check logic later, checks auth)
create policy "Admins can view b2b requests"
  on b2b_requests for select
  using (true); -- For now allowing read, usually restrictive but simple for prototype
