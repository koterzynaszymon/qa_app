# MeetAsk

Live Q&A platform for events, workshops, and meetings. Organizers create rooms, share them via link or QR code, and answer audience questions in real time.

## Features

- **Public landing page** — visitors can learn about the app and sign up or log in
- **Room management** — create, edit, delete, and open/close Q&A rooms
- **Live Q&A** — participants ask questions without creating an account
- **Moderation** — room owners can add moderators to help answer and manage questions
- **Question filters** — view all, answered, or unanswered questions
- **QR sharing** — share a room with a scannable QR code
- **Room status** — close a room to stop accepting new questions

## Tech stack

- [Next.js](https://nextjs.org) (App Router, Server Actions)
- [Supabase](https://supabase.com) (Auth, Postgres, Row Level Security)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org)

## Getting started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project

### 1. Clone and install

```bash
git clone <your-repo-url>
cd qa_app
npm install
```

### 2. Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_or_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`NEXT_PUBLIC_APP_URL` is used for QR code room links.

### 3. Database setup

Apply migrations with the Supabase CLI:

```bash
supabase db push
```

Or run migrations locally:

```bash
supabase migration up
```

Migration files live in `supabase/migrations/`.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  (auth)/          # Login, sign-up, password reset
  (protected)/     # Authenticated dashboard
  room/[id]/       # Public Q&A room pages
  page.tsx         # Landing page

actions/           # Server actions (rooms, questions, answers, users)
components/        # UI components
lib/supabase/      # Supabase client helpers
supabase/migrations/  # Database schema
```

## Main flows

### Organizer

1. Sign up and log in
2. Create a room from the dashboard
3. Share the room link or QR code with the audience
4. Answer questions and manage moderators
5. Close the room when Q&A should stop

### Participant

1. Open a shared room link (no account required)
2. Submit a question while the room is open
3. View answered questions in the room

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start development server |
| `npm run build`| Build for production     |
| `npm run start`| Start production server  |
| `npm run lint` | Run ESLint               |

## Database

Core tables:

- `profiles` — user profiles linked to Supabase Auth
- `rooms` — Q&A rooms (`is_open` controls whether new questions are accepted)
- `questions` — questions submitted in a room
- `room_moderators` — moderators assigned to a room
- `votes` — question voting (schema present)

## Deployment

1. Deploy the Next.js app (e.g. [Vercel](https://vercel.com))
2. Set the same environment variables in your hosting provider
3. Point `NEXT_PUBLIC_APP_URL` to your production URL
4. Run `supabase db push` against your production Supabase project

## To Do
1. Implement question like voting system.

## License

Private project.
