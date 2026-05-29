create table votes (
    question_id uuid references questions(id) on delete cascade not null,
    fingerprint text not null,
    primary key (question_id, fingerprint)
);

alter table votes enable row level security;

create policy "Votes are publicly accessible by everyone"
    on votes for select
    using ( true );

create policy "Anyone can vote on a question"
    on votes for insert
    to anon, authenticated
    with check ( true );

create policy "Anyone can remove their own vote"
    on votes for delete
    to anon, authenticated
    using ( true );
