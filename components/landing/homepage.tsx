import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MessageCircleQuestion,
  QrCode,
  Users,
  Filter,
  Shield,
  Zap,
} from "lucide-react";

const steps = [
  {
    step: "1",
    title: "Create a room",
    description:
      "Sign up, give your event a name, and set up a dedicated Q&A space in seconds.",
  },
  {
    step: "2",
    title: "Share with your audience",
    description:
      "Send a link or show a QR code. Participants can join and ask questions without creating an account.",
  },
  {
    step: "3",
    title: "Answer live",
    description:
      "You and your moderators review incoming questions, respond on the spot, and keep the conversation moving.",
  },
];

const features = [
  {
    icon: MessageCircleQuestion,
    title: "Open Q&A for everyone",
    description:
      "Audience members submit questions from any device. No app install, no sign-up friction.",
  },
  {
    icon: QrCode,
    title: "Instant sharing",
    description:
      "Generate a QR code or copy a room link. Perfect for conferences, meetups, classrooms, and town halls.",
  },
  {
    icon: Users,
    title: "Team moderation",
    description:
      "Add moderators to help you answer questions and manage the room during busy sessions.",
  },
  {
    icon: Filter,
    title: "Stay organized",
    description:
      "Filter between all, answered, and unanswered questions so nothing slips through.",
  },
  {
    icon: Shield,
    title: "You stay in control",
    description:
      "Room owners decide who moderates. Delete off-topic questions and keep discussions on track.",
  },
  {
    icon: Zap,
    title: "Built for live events",
    description:
      "A simple, focused interface designed for real-time Q&A — not another cluttered chat tool.",
  },
];

export default function Homepage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            MeetAsk
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Live Q&A for events
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Collect questions from your audience. Answer them in real time.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                MeetAsk helps organizers run smooth Q&A sessions at conferences,
                workshops, and team meetings. Create a room, share a link, and
                let your audience ask — no account required for participants.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/sign-up">Create your first room</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login">I already have an account</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-muted-foreground">
              Three steps from setup to live Q&A.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="relative text-center md:text-left">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need for live Q&A
              </h2>
              <p className="mt-4 text-muted-foreground">
                Simple tools for organizers. Zero friction for your audience.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="border-muted-foreground/10">
                  <CardHeader>
                    <feature.icon className="mb-2 h-8 w-8 text-primary" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Card className="border-muted-foreground/10 bg-muted/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl sm:text-3xl">
                Ready to run your next Q&A session?
              </CardTitle>
              <CardDescription className="text-base">
                Create a free account, set up your room, and share it with your
                audience in under a minute.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
              <Button size="lg" asChild>
                <Link href="/sign-up">Get started for free</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <p className="text-sm text-muted-foreground">
            © 2026 MeetAsk
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition-colors">
              Log in
            </Link>
            <Link href="/sign-up" className="hover:text-foreground transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
