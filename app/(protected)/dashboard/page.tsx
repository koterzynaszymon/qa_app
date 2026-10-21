import { getRooms } from "@/actions/rooms";
import CreateRoomButton from "@/components/protected/create-room-dialog";
import RoomCard from "@/components/protected/ui/room-card";
import WeeklyStatsCard from "@/components/protected/ui/weekly-stats-card";
import { CardMark } from "@/components/wordmark";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rooms = await getRooms();

  if (rooms.error) {
    return (
      <div className="px-4 py-10 sm:px-6">
        <p className="text-destructive">Rooms couldn&apos;t be loaded: {rooms.error}</p>
      </div>
    );
  }

  const roomList = rooms.data ?? [];
  const openCount = roomList.filter((room) => room.is_open ?? true).length;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:py-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_17rem]">
        <div className="min-w-0">
          <header className="mb-8">
            <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.035em]">
              Your rooms
            </h1>
            <p className="mt-1 text-muted-foreground">
              {roomList.length === 0
                ? user?.email
                : `${roomList.length} ${roomList.length === 1 ? "room" : "rooms"}, ${openCount} taking questions`}
            </p>
          </header>

          {roomList.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {roomList.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-start rounded-md border border-dashed p-8 sm:p-10">
              <CardMark className="h-9 w-12" />
              <h2 className="mt-5 text-xl font-semibold tracking-tight">
                No rooms yet
              </h2>
              <p className="mt-1.5 max-w-[42ch] leading-relaxed text-muted-foreground">
                Make one for your next talk or meeting. You&apos;ll get a link and
                a QR code to share with the audience.
              </p>
              <div className="mt-6">
                <CreateRoomButton />
              </div>
            </div>
          )}
        </div>

        <aside className="lg:pt-[5.75rem]">
          <Suspense
            fallback={<div className="h-48 animate-pulse rounded-md border bg-muted/40" />}
          >
            <WeeklyStatsCard />
          </Suspense>
          {user?.email && roomList.length > 0 && (
            <p className="mt-4 truncate text-sm text-muted-foreground">
              Signed in as {user.email}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
