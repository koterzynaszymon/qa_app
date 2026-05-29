"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { deleteQuestion } from "@/actions/questions";
import { toast } from "sonner";

interface QuestionCardProps {
  question: {
    id: string;
    content: string;
    is_answered: boolean;
    created_at: string;
  };
  roomId: string;
  canDelete: boolean;
}

export default function QuestionCard({ question, roomId, canDelete }: QuestionCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
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

  const timeAgo = formatTimeAgo(new Date(question.created_at));

  return (
    <Card
      className={`w-full flex flex-col ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
    >
      <CardContent className="pt-6">
        <p className="text-md">{question.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-auto">
        <span className="text-sm text-muted-foreground">{timeAgo}</span>
        {canDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <TrashIcon className="w-4 h-4" /> Delete
          </Button>
        )}
      </CardFooter>
    </Card>
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
