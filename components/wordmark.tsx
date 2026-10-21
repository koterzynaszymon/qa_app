import Link from "next/link";
import { cn } from "@/lib/utils";

export function CardMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 18"
      aria-hidden="true"
      className={cn("h-[18px] w-6 shrink-0", className)}
    >
      <rect
        x="0.75"
        y="0.75"
        width="22.5"
        height="16.5"
        rx="1.5"
        className="fill-card stroke-foreground"
        strokeWidth="1.5"
      />
      <line x1="7" y1="1.5" x2="7" y2="16.5" className="stroke-margin" strokeWidth="1.5" />
      <line x1="10" y1="7" x2="20" y2="7" className="stroke-primary" strokeWidth="1.5" />
      <line x1="10" y1="11.5" x2="16.5" y2="11.5" className="stroke-primary" strokeWidth="1.5" />
    </svg>
  );
}

export function Wordmark({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-sm text-[1.375rem] font-bold tracking-[-0.03em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <CardMark />
      MeetAsk
    </Link>
  );
}
