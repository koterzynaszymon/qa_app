"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { deleteRoom, toggleRoomOpen } from "@/actions/rooms";
import { toast } from "sonner";
import Link from "next/link";
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

  const handleToggleOpen = async (newValue: boolean) => {
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

  const handleDelete = async () => {
    if (!confirm(`Delete "${room.name}" and all of its questions?`)) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteRoom(room.id);
    if (result.error) {
      toast.error(result.error);
      setIsDeleting(false);
    } else {
      toast.success("Room deleted");
    }
  };

  return (
    <article
      className={`group relative flex min-h-48 flex-col rounded-md border bg-card transition-colors hover:border-primary/50 focus-within:border-primary/50 ${isDeleting ? "pointer-events-none opacity-50" : ""}`}
    >
      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span
            className={`h-2 w-2 rounded-full ${isOpen ? "bg-margin" : "border border-muted-foreground"}`}
          />
          {isOpen ? "Taking questions" : "Closed"}
          {!isOwner && <span className="ml-auto">You moderate</span>}
        </p>
        <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight">
          <Link
            href={`/room/${room.id}`}
            className="outline-none after:absolute after:inset-0 after:rounded-md group-hover:text-primary"
          >
            {room.name}
          </Link>
        </h2>
        {room.description && (
          <p className="mt-1.5 line-clamp-2 leading-relaxed text-muted-foreground">
            {room.description}
          </p>
        )}
      </div>
      {isOwner && (
        <div className="relative z-10 flex items-center gap-1 border-t px-3 py-2">
          <label className="mr-auto flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm">
            <Switch
              checked={isOpen}
              disabled={isToggling || isDeleting}
              onCheckedChange={handleToggleOpen}
            />
            Open
          </label>
          <EditRoomDialog room={room} />
          <Button
            variant="quiet"
            size="icon-sm"
            onClick={handleDelete}
            disabled={isDeleting}
            aria-label={`Delete ${room.name}`}
          >
            <TrashIcon />
          </Button>
        </div>
      )}
    </article>
  );
}
