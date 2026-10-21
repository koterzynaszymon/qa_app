function SidebarSkeleton() {
  return (
    <div className="border-b bg-card px-4 py-6 sm:px-8 md:border-b-0 md:border-r md:px-6 md:py-10">
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-4 w-full animate-pulse rounded bg-muted" />
      <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-muted" />
      <div className="mt-6 h-9 w-full animate-pulse rounded-md bg-muted" />
    </div>
  );
}

export function RoomPageSkeleton() {
  return (
    <div className="grid w-full flex-1 md:grid-cols-[19rem_1fr]">
      <SidebarSkeleton />
      <div className="min-w-0 px-4 pb-16 pt-6 sm:px-8 md:pt-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 h-[8.5rem] animate-pulse rounded-md border bg-card" />
          <QuestionsListSkeleton />
        </div>
      </div>
    </div>
  );
}

export function QuestionsListSkeleton() {
  return (
    <div>
      <div className="mb-5 h-10 border-b" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="qcard h-24 animate-pulse">
            <div />
            <div />
          </div>
        ))}
      </div>
    </div>
  );
}
