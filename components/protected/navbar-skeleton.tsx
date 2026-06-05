export default function NavbarSkeleton() {
  return (
    <div className="flex h-[72px] items-center justify-between border-b bg-black/50 px-4">
      <div className="h-8 w-32 animate-pulse rounded bg-muted/50" />
      <div className="flex gap-4">
        <div className="h-9 w-28 animate-pulse rounded-md bg-muted/50" />
        <div className="h-9 w-20 animate-pulse rounded-md bg-muted/50" />
      </div>
    </div>
  );
}
