import { PageLoader } from "@/components/ui/page-loader";

function SidebarSkeleton() {
  return (
    <div className="w-full shrink-0 border-b p-4 md:w-64 md:min-h-full md:border-b-0 md:border-r">
      <div className="flex flex-row gap-2 md:flex-col md:gap-4">
        <div className="h-9 flex-1 animate-pulse rounded-md bg-muted md:flex-none" />
        <div className="h-9 flex-1 animate-pulse rounded-md bg-muted md:flex-none" />
        <div className="h-9 flex-1 animate-pulse rounded-md bg-muted md:flex-none" />
      </div>
    </div>
  );
}

export function RoomPageSkeleton() {
  return (
    <div className="flex w-full flex-1 flex-col md:flex-row">
      <SidebarSkeleton />
      <div className="min-w-0 flex-1 p-4">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-8 w-40 animate-pulse rounded bg-muted" />
          <div className="flex gap-2">
            <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
            <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
        <PageLoader className="min-h-[200px] p-8" />
      </div>
    </div>
  );
}

export function QuestionsListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-24 animate-pulse rounded-lg border bg-muted/30"
        />
      ))}
    </div>
  );
}
