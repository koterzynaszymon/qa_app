import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/wordmark";

const demoQuestions = [
  {
    number: 12,
    content: "Do you vacuum manually or trust autovacuum on tables that big?",
    answer: "Autovacuum, with the scale factor turned way down on the hot tables.",
    time: "4m ago",
  },
  {
    number: 13,
    content: "If you could only add one index on Monday, which would it be?",
    answer: null,
    time: "2m ago",
  },
  {
    number: 14,
    content: "Will the slides be shared after the talk?",
    answer: null,
    time: "just now",
  },
];

const timeline = [
  {
    when: "Before",
    title: "Set up a room",
    body: "Name it after your talk or meeting. Add a co-host as moderator so you are not answering alone.",
  },
  {
    when: "During",
    title: "Put the code on screen",
    body: "People scan it, type a question and hit send. Questions land in your list in the order they were asked.",
  },
  {
    when: "After",
    title: "Close the room",
    body: "New questions stop. Everything that was asked and answered stays readable at the same link.",
  },
];

export default function Homepage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/85 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Wordmark />
          <nav className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Create a room</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl gap-14 px-4 pb-20 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:pb-28">
          <div>
            <h1 className="max-w-[12ch] text-[clamp(2.75rem,7vw,5.25rem)] font-extrabold leading-[0.95] tracking-[-0.045em]">
              The back row has questions too.
            </h1>
            <p className="mt-7 max-w-[46ch] text-lg leading-relaxed text-muted-foreground">
              MeetAsk gives your audience a link and a QR code. They send
              questions from their phones, without an account. You answer them
              live, in the order they came in.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button size="lg" asChild className="h-12 px-6 text-base">
                <Link href="/sign-up">Create a free room</Link>
              </Button>
              <Button size="lg" variant="ghost" asChild className="h-12 px-4 text-base">
                <Link href="/login">Log in</Link>
              </Button>
            </div>
          </div>

          <DemoRoom />
        </section>

        <section className="border-y bg-card">
          <div className="mx-auto grid max-w-6xl md:grid-cols-2">
            <div className="border-b px-4 py-14 sm:px-6 md:border-b-0 md:border-r md:py-20 md:pr-12">
              <h2 className="text-[1.75rem] font-bold leading-tight tracking-[-0.03em]">
                On stage
              </h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                <Point>See every question numbered, so you can say &ldquo;question seven&rdquo; and everyone knows which one.</Point>
                <Point>Switch between what&rsquo;s still waiting and what you&rsquo;ve already covered.</Point>
                <Point>Write a short answer for the people who arrive late or watch the recording.</Point>
                <Point>Bring in moderators by email to sort and answer with you.</Point>
              </ul>
            </div>
            <div className="px-4 py-14 sm:px-6 md:py-20 md:pl-12">
              <h2 className="text-[1.75rem] font-bold leading-tight tracking-[-0.03em]">
                In the seats
              </h2>
              <ul className="mt-6 space-y-4 text-muted-foreground">
                <Point>Scan the code, type, send. No app, no sign-up, no name required.</Point>
                <Point>Ask the question you wouldn&rsquo;t ask into a microphone.</Point>
                <Point>Watch answers appear on the same page as they&rsquo;re written.</Point>
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24">
          <h2 className="max-w-[20ch] text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.035em]">
            One room per session, from the first slide to the last question.
          </h2>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-md border bg-border md:grid-cols-3">
            {timeline.map((item) => (
              <li key={item.when} className="bg-background p-6 md:p-8">
                <p className="text-sm font-semibold text-primary">{item.when}</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-foreground text-background">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between">
            <p className="max-w-[28ch] text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight tracking-[-0.03em]">
              Your next session starts with an empty card.
            </p>
            <Button
              size="lg"
              asChild
              className="h-12 bg-background px-6 text-base text-foreground hover:bg-background/90"
            >
              <Link href="/sign-up">Create a free room</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 MeetAsk</p>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-foreground">
              Log in
            </Link>
            <Link href="/sign-up" className="hover:text-foreground">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Point({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 leading-relaxed">
      <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-margin" />
      <span>{children}</span>
    </li>
  );
}

function DemoRoom() {
  return (
    <div
      className="relative mx-auto w-full max-w-[34rem]"
      aria-label="Example of a MeetAsk room during a talk"
      role="img"
    >
      <div className="mb-4 flex items-baseline justify-between gap-4 px-1">
        
        <p className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
          <span className="live-dot h-2 w-2 rounded-full bg-margin" />
          Live
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {demoQuestions.map((question, index) => (
          <div
            key={question.number}
            className="qcard deal shadow-[0_1px_0_hsl(var(--rule)),0_14px_30px_-22px_hsl(231_51%_12%/0.5)]"
            style={{ animationDelay: `${200 + index * 380}ms` }}
          >
            <div className="qcard-num">Q{question.number}</div>
            <div className="qcard-body">
              <p className="text-[1.0625rem] font-medium leading-snug">
                {question.content}
              </p>
              {question.answer ? (
                <p className="mt-3 border-l-2 border-primary pl-3 text-sm leading-relaxed text-muted-foreground">
                  {question.answer}
                </p>
              ) : null}
              <p className="mt-3 text-xs text-muted-foreground">
                {question.answer ? `Answered, asked ${question.time}` : question.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
