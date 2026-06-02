"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { deleteRoom } from "@/actions/rooms";
import { toast } from "sonner";
import Link from "next/link";
import type { MouseEvent } from "react";
import EditRoomDialog from "../edit-room-dialog";

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    description: string;
  };
}

export default function RoomCard({ room }: RoomCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this room?")) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteRoom(room.id);
    if (result.error) {
      toast.error(result.error);
      setIsDeleting(false);
    } else {
      toast.success("Room deleted successfully");
    }
  };

  return (
    <Link href={`/room/${room.id}`} className="block hover:opacity-80 transition-opacity">
      <Card
        className={`w-full h-56 flex flex-col ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
      >
        <CardHeader className="pb-3 flex">
          <CardTitle className="leading-snug">{room.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-md text-muted-foreground line-clamp-2 md:line-clamp-3">
            {room.description}
          </p>
        </CardContent>
        <CardFooter className="gap-6 mt-auto">
          <div
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <EditRoomDialog room={room} />
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <TrashIcon /> Delete
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
