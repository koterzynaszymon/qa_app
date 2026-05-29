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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createQuestion } from "@/actions/questions";
import { toast } from "sonner";

export default function CreateQuestionButton({ roomId }: { roomId: string }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await createQuestion({ roomId, content });

      if (response.error) {
        setError(response.error);
      } else {
        toast.success("Question submitted");
        setOpen(false);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
      setContent("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="w-4 h-4" /> Ask a Question
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Ask a Question</DialogTitle>
          <DialogDescription>
            Submit your question to the room.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateQuestion}>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="content">Your Question</Label>
              <Textarea
                id="content"
                placeholder="Type your question here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
            <Button type="submit" disabled={isLoading || !content.trim()}>
              <PlusIcon className="w-4 h-4" /> {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
