import { LogoutButton } from "@/components/logout-button";
import { Wordmark } from "@/components/wordmark";
import CreateRoomButton from "./create-room-dialog";

export default async function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Wordmark href="/dashboard" />
        <div className="flex items-center gap-1 sm:gap-2">
          <CreateRoomButton />
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
