"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PencilIcon, XIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { updateRoom } from "@/actions/rooms";
import { toast } from "sonner";

interface EditRoomDialogProps {
  room: {
    id: string;
    name: string;
    description: string;
  };
}

export default function EditRoomDialog({ room }: EditRoomDialogProps) {
  const [roomName, setRoomName] = useState(room.name);
  const [roomDescription, setRoomDescription] = useState(room.description);
  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleEditRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await updateRoom(room.id, {
        name: roomName,
        description: roomDescription,
      });

      if (response.error) {
        setError(response.error);
      } else {
        toast.success("Room updated successfully");
        setOpen(false);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setRoomName(room.name);
      setRoomDescription(room.description);
      setError(null);
    }
    setOpen(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <PencilIcon className="w-4 h-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
          <DialogDescription>Update room details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditRoom}>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="My Room"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                placeholder="Type your room description here."
                value={roomDescription}
                onChange={(e) => setRoomDescription(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          <div className="flex justify-between gap-2 mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                <XIcon className="w-4 h-4" /> Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading} onClick={handleEditRoom}>
              <PencilIcon className="w-4 h-4" />{" "}
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
