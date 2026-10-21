"use client";

import { createAnswer, deleteAnswer } from "@/actions/answers";
import { deleteQuestion } from "@/actions/questions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Question {
  id: string;
  number: number;
  content: string;
  answer: string | null;
  is_answered: boolean;
  created_at: string;
}

interface QuestionCardProps {
  question: Question;
  roomId: string;
  canDelete: boolean;
  canAnswer: boolean;
}

export default function QuestionCard({
  question,
  roomId,
  canDelete,
  canAnswer,
}: QuestionCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteQuestion = async () => {
    if (!confirm(`Delete question ${question.number}?`)) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteQuestion(question.id, roomId);
    if (result.error) {
      toast.error(result.error);
      setIsDeleting(false);
    } else {
      toast.success("Question deleted");
    }
  };

  return (
    <article
      className={`qcard ${isDeleting ? "pointer-events-none opacity-50" : ""}`}
      aria-label={`Question ${question.number}`}
    >
      <div className="qcard-num">Q{question.number}</div>
      <div className="qcard-body">
        <div className="flex items-start gap-3">
          <p className="min-w-0 flex-1 whitespace-pre-line text-[1.0625rem] font-medium leading-snug [overflow-wrap:anywhere]">
            {question.content}
          </p>
          {canDelete && (
            <Button
              variant="quiet"
              size="icon-sm"
              className="-mr-2 -mt-1"
              onClick={handleDeleteQuestion}
              disabled={isDeleting}
              aria-label={`Delete question ${question.number}`}
            >
              <TrashIcon />
            </Button>
          )}
        </div>

        {question.is_answered && question.answer && (
          <QuestionAnswerDisplay
            answer={question.answer}
            canDelete={canDelete}
            questionId={question.id}
            roomId={roomId}
          />
        )}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <time
            dateTime={question.created_at}
            className="text-xs text-muted-foreground"
          >
            {formatTimeAgo(new Date(question.created_at))}
          </time>
          {canAnswer && <QuestionAnswerForm questionId={question.id} />}
        </div>
      </div>
    </article>
  );
}

function QuestionAnswerDisplay({
  answer,
  canDelete,
  questionId,
  roomId,
}: {
  answer: string;
  canDelete: boolean;
  questionId: string;
  roomId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAnswer = async () => {
    if (!confirm("Remove this answer? The question will go back to unanswered.")) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteAnswer({ questionId, roomId });
    if (result.error) {
      toast.error(result.error);
      setIsDeleting(false);
    } else {
      toast.success("Answer removed");
    }
  };

  return (
    <div className={`mt-3 border-l-2 border-primary pl-3 ${isDeleting ? "opacity-50" : ""}`}>
      <div className="flex items-start gap-3">
        <p className="min-w-0 flex-1 whitespace-pre-line leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
          <span className="sr-only">Answer: </span>
          {answer}
        </p>
        {canDelete && (
          <Button
            variant="quiet"
            size="sm"
            className="-mr-2 -mt-1 h-7 px-2"
            onClick={handleDeleteAnswer}
            disabled={isDeleting}
          >
            Remove answer
          </Button>
        )}
      </div>
    </div>
  );
}

function QuestionAnswerForm({ questionId }: { questionId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createAnswer({ questionId, answer });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Answer posted");
        setIsOpen(false);
        setAnswer("");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The answer wasn't posted. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="-mr-2 text-primary hover:text-primary"
        onClick={() => setIsOpen(true)}
      >
        Answer
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-1 w-full">
      <label htmlFor={`answer-${questionId}`} className="sr-only">
        Your answer
      </label>
      <Textarea
        id={`answer-${questionId}`}
        autoFocus
        placeholder="Write a short answer for everyone in the room."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setIsOpen(false);
        }}
      />
      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isSubmitting || !answer.trim()}>
          {isSubmitting ? "Posting…" : "Post answer"}
        </Button>
      </div>
    </form>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
