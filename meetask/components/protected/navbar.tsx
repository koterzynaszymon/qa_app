import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import CreateRoomButton from "./create-room-dialog";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="flex justify-between items-center p-4 bg-black/50 backdrop-blur-sm border-b">
      <h3 className="text-3xl font-bold">Meetask</h3>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{user?.email}</span>
        <CreateRoomButton/>
        <LogoutButton />
      </div>
    </nav>
  );
}
