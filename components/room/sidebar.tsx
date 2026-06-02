import Link from "next/link";
import { Button } from "../ui/button"
import AddModeratorDialog from "./add-moderator-dialog";

export default function RoomSidebar({ roomId, filter }: { roomId: string, filter: "all" | "answered" | "unanswered" }) {
    return (
      <div className="w-64 min-h-full text-white border-r">
        <div className="flex flex-col gap-4 p-4">
          <Link href={`/room/${roomId}?filter=all`}>
            <Button variant={filter === "all" || !filter ? "secondary" : "outline" } className="w-full">
              <h3>All</h3>
            </Button>
          </Link>
          <Link href={`/room/${roomId}?filter=answered`}>
            <Button variant={filter === "answered" ? "secondary" : "outline"} className="w-full">
              <h3>Answered</h3>
            </Button>
          </Link>
          <Link href={`/room/${roomId}?filter=unanswered`}>
            <Button variant={filter === "unanswered" ? "secondary" : "outline"} className="w-full">
              <h3>Unanswered</h3>
            </Button>
          </Link>
          <AddModeratorDialog roomId={roomId} />
        </div>
      </div>
    );
}