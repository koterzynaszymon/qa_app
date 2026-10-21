"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon, UsersIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getRoomModerators,
  removeModeratorFromRoom,
} from "@/actions/roomModerators";

interface Moderator {
  user_id: string;
  email: string;
}

export default function ManageModeratorsDialog({ roomId }: { roomId: string }) {
  const [open, setOpen] = useState(false);
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadModerators = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await getRoomModerators(roomId);
    if (error) {
      toast.error(error);
    } else {
      setModerators(data ?? []);
    }
    setIsLoading(false);
  }, [roomId]);

  useEffect(() => {
    if (open) {
      loadModerators();
    }
  }, [open, loadModerators]);

  const handleRemove = async (userId: string) => {
    setRemovingId(userId);
    const result = await removeModeratorFromRoom(roomId, userId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Moderator removed");
      setModerators((prev) => prev.filter((m) => m.user_id !== userId));
    }
    setRemovingId(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <UsersIcon className="w-4 h-4" /> Moderators
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Moderators</DialogTitle>
          <DialogDescription>
            People who can answer and delete questions in this room.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : moderators.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No moderators yet. Add one by email to share the work.
            </p>
          ) : (
            moderators.map((moderator) => (
              <div
                key={moderator.user_id}
                className="flex items-center justify-between gap-2 border-b py-2 last:border-b-0"
              >
                <span className="text-sm truncate">{moderator.email}</span>
                <Button
                  variant="quiet"
                  size="icon-sm"
                  className="shrink-0"
                  onClick={() => handleRemove(moderator.user_id)}
                  disabled={removingId === moderator.user_id}
                  aria-label={`Remove ${moderator.email}`}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
