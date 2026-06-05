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
import { deleteRoom, toggleRoomOpen } from "@/actions/rooms";
import { toast } from "sonner";
import Link from "next/link";
import type { ChangeEvent, MouseEvent } from "react";
import EditRoomDialog from "../edit-room-dialog";

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    description: string;
    is_open?: boolean;
    is_owner?: boolean;
  };
}

export default function RoomCard({ room }: RoomCardProps) {
  const isOwner = room.is_owner ?? true;
  const [isOpen, setIsOpen] = useState(room.is_open ?? true);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleOpen = async (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();

    const newValue = e.target.checked;
    setIsOpen(newValue);
    setIsToggling(true);

    const result = await toggleRoomOpen(room.id, newValue);
    if (result.error) {
      setIsOpen(!newValue);
      toast.error(result.error);
    } else {
      toast.success(newValue ? "Room opened" : "Room closed");
    }

    setIsToggling(false);
  };
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
        className={`w-full ${isOwner ? "h-56" : "h-40"} flex flex-col ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="leading-snug">{room.name}</CardTitle>
            {isOwner && (
              <label
                className="group flex items-center gap-2 text-sm text-muted-foreground shrink-0 cursor-pointer rounded-md px-2 py-1 transition-colors hover:text-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={isOpen}
                  disabled={isToggling || isDeleting}
                  onChange={handleToggleOpen}
                  onClick={(e) => e.stopPropagation()}
                  className="h-4 w-4 rounded border border-input accent-primary cursor-pointer transition-all hover:brightness-125"
                />
                Open
              </label>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-md text-muted-foreground line-clamp-2 md:line-clamp-3">
            {room.description}
          </p>
        </CardContent>
        {isOwner && (
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
        )}
      </Card>
    </Link>
  );
}
