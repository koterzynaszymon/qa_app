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
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { addModeratorToRoom } from "@/actions/roomModerators";

export default function AddModeratorDialog({ roomId }: { roomId: string }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await addModeratorToRoom(roomId, email);

      if (response.error) {
        setError(response.error);
      } else {
        toast.success("Moderator added");
        setOpen(false);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred, try again later");
    } finally {
      setIsLoading(false);
      setEmail("");
    }
  };



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <PlusIcon className="w-4 h-4" /> Add moderator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add moderator</DialogTitle>
          <DialogDescription>
            Moderators can answer and delete questions in this room. They need
            a MeetAsk account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateQuestion}>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="moderator-email">Email</Label>
              <Input
                id="moderator-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          <div className="flex justify-end gap-2 mt-6">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading || !email.trim()}>
              {isLoading ? "Adding…" : "Add moderator"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
