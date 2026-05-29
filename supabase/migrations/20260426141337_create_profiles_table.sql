create table profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    email text unique not null
);

alter table profiles enable row level security;

create policy "Profiles are publicly accessible by everyone"
    on profiles for select
    using ( true );

create policy "Users can insert their own profile"
    on profiles for insert
    to authenticated
    with check ( auth.uid() = id );

create policy "Users can update their own profile"
    on profiles for update
    to authenticated
    using ( auth.uid() = id )
    with check ( auth.uid() = id );
