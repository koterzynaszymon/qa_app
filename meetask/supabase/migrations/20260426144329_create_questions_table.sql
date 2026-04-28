create table questions (
    id uuid primary key default gen_random_uuid(),
    room_id uuid references rooms(id) on delete cascade not null,
    content text not null,
    answer text,
    is_answered boolean not null default false,
    created_at timestamp with time zone default now() not null
);

alter table questions enable row level security;

create policy "Questions are publicly accessible by everyone"
    on questions for select
    using ( true );

create policy "Anyone can ask a question"
    on questions for insert
    to anon, authenticated
    with check ( true );

create policy "Room owner or moderators can delete questions"
    on questions for delete
    to authenticated
    using (
        EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.id = room_id
            AND rooms.owner_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM room_moderators
            WHERE room_moderators.room_id = questions.room_id
            AND room_moderators.user_id = auth.uid()
        )
    );

create policy "Room owner or moderators can mark as answered"
    on questions for update
    to authenticated
    using (
        EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.id = room_id
            AND rooms.owner_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM room_moderators
            WHERE room_moderators.room_id = questions.room_id
            AND room_moderators.user_id = auth.uid()
        )
    )
    with check (
        EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.id = room_id
            AND rooms.owner_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM room_moderators
            WHERE room_moderators.room_id = questions.room_id
            AND room_moderators.user_id = auth.uid()
        )
    );
