import { getRooms } from "@/actions/rooms";
import RoomCard from "@/components/protected/ui/room-card";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let email = user?.email;
  if (!email) {
    email = "Error fetching user email"
  }

  const rooms = await getRooms();

  if (rooms.error) {
    return <div className="p-4">Error: {rooms.error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center md:text-left">
        Your rooms
      </h1>
      <p className="text-muted-foreground mb-5 text-center md:text-left">
        {email}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rooms.data?.map((room) => {
          return <RoomCard key={room.id} room={room} />;
        })}
      </div>
    </div>
  );  
}