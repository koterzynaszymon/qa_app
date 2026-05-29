create table room_moderators (
    room_id uuid references rooms(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    created_at timestamp with time zone default now() not null,
    primary key (room_id, user_id)
);

alter table room_moderators enable row level security;

CREATE POLICY "Room moderators are publicly accessible by everyone"
    on room_moderators for select
    using ( true );

CREATE POLICY "Only the room owner can add moderators"
    on room_moderators for INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 from rooms
            where rooms.id = room_id
            and rooms.owner_id = auth.uid()
        )
    );

CREATE POLICY "Owner can remove moderator or moderator can remove themselves"
    on room_moderators for DELETE
    USING (
        auth.uid() = user_id
        OR 
        EXISTS (
            SELECT 1 from rooms
            where rooms.id = room_id
            and rooms.owner_id = auth.uid()
        )
    );