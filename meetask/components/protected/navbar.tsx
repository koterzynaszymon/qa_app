import { LogoutButton } from "@/components/logout-button";
import CreateRoomButton from "./create-room-dialog";

export default async function Navbar() {

  return (
    <nav className="flex justify-between items-center p-4 bg-black/50 backdrop-blur-sm border-b">
      <h3 className="text-3xl font-bold">Meetask</h3>
      <div className="flex items-center gap-4">
        <CreateRoomButton/>
        <LogoutButton />
      </div>
    </nav>
  );
}
