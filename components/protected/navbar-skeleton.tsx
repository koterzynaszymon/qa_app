export default function NavbarSkeleton() {
  return (
    <div className="flex h-16 items-center justify-between border-b px-4 sm:px-6">
      <div className="h-6 w-32 animate-pulse rounded bg-muted" />
      <div className="flex gap-2">
        <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  );
}
