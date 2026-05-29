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
import { PlusIcon, XIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { createRoom } from "@/actions/rooms";
import { toast } from "sonner";

export default function CreateRoomButton() {
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try{
      const response = await createRoom({name: roomName, description: roomDescription});

      if (response.error) {
        setError(response.error);
      } else {
        toast.success("Room created successfully");
        setOpen(false);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
      setRoomName("");
      setRoomDescription("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="w-4 h-4" /> Create Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Room</DialogTitle>
          <DialogDescription>
            Create a new Q&A room for your event.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateRoom}>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Room Name</Label>
              <Input id="name" name="name" placeholder="My Room" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea placeholder="Type your room description here." value={roomDescription} onChange={(e) => setRoomDescription(e.target.value)} />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          <div className="flex justify-between gap-2 mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline"><XIcon className="w-4 h-4" /> Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}><PlusIcon className="w-4 h-4" /> {isLoading ? "Creating..." : "Create Room"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
