create table rooms (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    owner_id uuid references auth.users(id) on delete cascade not null,
    description text,
    created_at timestamp with time zone default now() not null
);

alter table rooms enable row level security;

create policy "Rooms are publicly accessible by everyone"
    on rooms for select
    using ( true );

create policy "Only logged in users can create rooms"
    on rooms for insert
    to authenticated
    with check ( auth.uid() = owner_id );

create policy "Only the owner can update their own room"
    on rooms for update
    to authenticated
    using ( auth.uid() = owner_id )
    with check ( auth.uid() = owner_id );

create policy "Only the owner can delete their own room"
    on rooms for delete
    to authenticated
    using ( auth.uid() = owner_id );
