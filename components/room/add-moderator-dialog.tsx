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
import { PlusIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { addModeratorToRoom } from "@/actions/roomModerators";
import { checkIfOwner as checkIfOwnerAction } from "@/actions/users";

export default function AddModeratorDialog({ roomId }: { roomId: string }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [isOwner, setIsOwner] = useState(false);

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await addModeratorToRoom(roomId, email);

      if (response.error) {
        setError(response.error);
      } else {
        toast.success("Moderator added successfully");
        setOpen(false);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred, try again later");
    } finally {
      setIsLoading(false);
      setEmail("");
    }
  };


  useEffect(() => {
    const checkIfOwner = async () => {
      const {data} = await checkIfOwnerAction(roomId);
      if (data) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    };
    checkIfOwner();
  }, [roomId]);


  return (
    <>
    {isOwner ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <PlusIcon className="w-4 h-4" /> Add Moderator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Moderator</DialogTitle>
          <DialogDescription>
            Add a moderator to the room.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateQuestion}>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Input
                id="email"
                placeholder="Email of the moderator"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <Button type="submit" disabled={isLoading || !email.trim()}>
              <PlusIcon className="w-4 h-4" />{" "}
              {isLoading ? "Adding..." : "Add Moderator"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  ) : (
    <p></p>
  )}
  </>
  );
}
