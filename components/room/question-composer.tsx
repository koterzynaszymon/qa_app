"use client";

import { createQuestion } from "@/actions/questions";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function QuestionComposer({
  roomId,
  isRoomOpen,
}: {
  roomId: string;
  isRoomOpen: boolean;
}) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim() || isLoading) {
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await createQuestion({ roomId, content });

      if (response.error) {
        setError(response.error);
      } else {
        toast.success("Question sent");
        setContent("");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "The question wasn't sent. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isRoomOpen) {
    return (
      <div className="mb-10 rounded-md border border-dashed px-5 py-4 text-muted-foreground">
        This room is closed, so new questions can&apos;t be sent. Everything
        asked so far is below.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-10 rounded-md border bg-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
    >
      <label htmlFor="question" className="sr-only">
        Your question
      </label>
      <textarea
        id="question"
        rows={3}
        maxLength={1000}
        placeholder="Ask the room a question…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            handleSubmit();
          }
        }}
        className="ruled block w-full resize-none bg-transparent px-5 pt-[0.3rem] text-[1.0625rem] leading-7 outline-none placeholder:text-muted-foreground"
      />
      <div className="flex items-center justify-between gap-4 border-t px-3 py-2.5 sm:px-5">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {error ? (
            <span className="text-destructive">{error}</span>
          ) : (
            "Anonymous. No account needed."
          )}
        </p>
        <Button type="submit" disabled={isLoading || !content.trim()}>
          {isLoading ? "Sending…" : "Send question"}
        </Button>
      </div>
    </form>
  );
}
