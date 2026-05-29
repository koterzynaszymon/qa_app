"use client";

import { createAnswer, deleteAnswer } from "@/actions/answers";
import { deleteQuestion } from "@/actions/questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Check, TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Question {
  id: string;
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
    if (!confirm("Are you sure you want to delete this question?")) {
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
    <Card
      className={`w-full flex flex-col ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
    >
      <CardContent className="pt-6">
        <p className="text-md">{question.content}</p>
      </CardContent>
      <CardFooter className="mt-auto flex flex-col gap-2">
        <QuestionCardMeta
          createdAt={question.created_at}
          canDelete={canDelete}
          isDeleting={isDeleting}
          onDelete={handleDeleteQuestion}
        />
        {question.is_answered && question.answer && (
          <QuestionAnswerDisplay
            answer={question.answer}
            canDelete={canDelete}
            questionId={question.id}
            roomId={roomId}
          />
        )}
        {canAnswer && <QuestionAnswerForm questionId={question.id} />}
      </CardFooter>
    </Card>
  );
}

function QuestionCardMeta({
  createdAt,
  canDelete,
  isDeleting,
  onDelete,
}: {
  createdAt: string;
  canDelete: boolean;
  isDeleting: boolean;
  onDelete: () => void;
}) {
  return (
    <div className="flex justify-between items-center w-full">
      <span className="text-sm text-muted-foreground">
        {formatTimeAgo(new Date(createdAt))}
      </span>
      {canDelete && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={isDeleting}
        >
          <TrashIcon className="w-4 h-4" /> Delete
        </Button>
      )}
    </div>
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
    if (!confirm("Are you sure you want to delete this answer?")) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteAnswer({ questionId, roomId });
    if (result.error) {
      toast.error(result.error);
      setIsDeleting(false);
    } else {
      toast.success("Answer deleted");
    }
  };

  return (
    <div className="w-full mt-2 rounded-md border bg-muted/50 p-3">
      <div className="flex justify-between items-start gap-2">
        <p className="text-sm font-medium text-muted-foreground">Answer</p>
        {canDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteAnswer}
            disabled={isDeleting}
          >
            <TrashIcon className="w-4 h-4" /> Delete answer
          </Button>
        )}
      </div>
      <p className="text-md mt-1">{answer}</p>
    </div>
  );
}

function QuestionAnswerForm({ questionId }: { questionId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast.error("Answer cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createAnswer({ questionId, answer });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Answer submitted");
        setIsOpen(false);
        setAnswer("");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="w-full mt-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Check className="w-4 h-4" /> {isOpen ? "Cancel" : "Answer question"}
      </Button>
      {isOpen && (
        <>
          <Textarea
            placeholder="Type your answer here..."
            className="w-full mt-4"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <Button
            variant="secondary"
            size="sm"
            className="mt-2 self-end"
            onClick={handleSubmit}
            disabled={isSubmitting || !answer.trim()}
          >
            <Check className="w-4 h-4" /> Submit Answer
          </Button>
        </>
      )}
    </>
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
