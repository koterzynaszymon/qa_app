import Link from "next/link";
import { Button } from "../ui/button"
import AddModeratorDialog from "./add-moderator-dialog";
import ManageModeratorsDialog from "./manage-moderators-dialog";

export default function RoomSidebar({ roomId, filter }: { roomId: string, filter: "all" | "answered" | "unanswered" }) {
    return (
      <div className="w-full md:w-64 md:min-h-full border-b md:border-b-0 md:border-r shrink-0">
        <div className="flex flex-row md:flex-col gap-2 md:gap-4 p-4">
          <Link href={`/room/${roomId}?filter=all`} className="flex-1 md:flex-none">
            <Button variant={filter === "all" || !filter ? "secondary" : "outline" } className="w-full">
              All
            </Button>
          </Link>
          <Link href={`/room/${roomId}?filter=answered`} className="flex-1 md:flex-none">
            <Button variant={filter === "answered" ? "secondary" : "outline"} className="w-full">
              Answered
            </Button>
          </Link>
          <Link href={`/room/${roomId}?filter=unanswered`} className="flex-1 md:flex-none">
            <Button variant={filter === "unanswered" ? "secondary" : "outline"} className="w-full">
              Unanswered
            </Button>
          </Link>
        </div>
        <div className="flex flex-col gap-2 px-4 pb-4">
          <AddModeratorDialog roomId={roomId} />
          <ManageModeratorsDialog roomId={roomId} />
        </div>
      </div>
    );
}