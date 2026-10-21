import { getWeeklyQuestionStats } from "@/actions/questions";

export default async function WeeklyStatsCard() {
  const { data, error } = await getWeeklyQuestionStats();

  if (error || !data) {
    return null;
  }

  const max = Math.max(1, ...data.daily.map((day) => day.count));

  return (
    <section className="rounded-md border bg-card p-5">
      <h2 className="text-sm text-muted-foreground">Questions this week</h2>
      <p className="mt-1 text-4xl font-bold tabular-nums tracking-tight">
        {data.total}
      </p>
      <div className="mt-5 flex h-20 items-end gap-0.5" aria-hidden="true">
        {data.daily.map((day) => (
          <div
            key={day.key}
            className="group relative flex h-full flex-1 flex-col justify-end"
          >
            <span className="pointer-events-none absolute -top-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded border bg-popover px-1.5 py-0.5 text-xs tabular-nums opacity-0 transition-opacity group-hover:opacity-100">
              {day.count} on {day.label}
            </span>
            <div
              className="mx-auto w-full max-w-6 rounded-t-[4px] bg-primary transition-opacity group-hover:opacity-80"
              style={{
                height: day.count > 0 ? `${(day.count / max) * 100}%` : "2px",
                opacity: day.count > 0 ? undefined : 0.3,
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-0.5 border-t pt-1.5 text-center text-xs text-muted-foreground" aria-hidden="true">
        {data.daily.map((day) => (
          <span key={day.key} className="flex-1">
            {day.label.slice(0, 2)}
          </span>
        ))}
      </div>
      <ul className="sr-only">
        {data.daily.map((day) => (
          <li key={day.key}>
            {day.label}: {day.count} questions
          </li>
        ))}
      </ul>
    </section>
  );
}
