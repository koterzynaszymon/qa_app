"use client";

import QuestionCard from "@/components/room/ui/question-card";
import { useState } from "react";

type Filter = "all" | "answered" | "unanswered";

interface Question {
  id: string;
  number: number;
  content: string;
  answer: string | null;
  is_answered: boolean;
  created_at: string;
}

const tabs: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unanswered", label: "Unanswered" },
  { value: "answered", label: "Answered" },
];

export default function QuestionList({
  questions,
  roomId,
  initialFilter,
  canModerate,
}: {
  questions: Question[];
  roomId: string;
  initialFilter: Filter;
  canModerate: boolean;
}) {
  const [filter, setFilter] = useState<Filter>(initialFilter);

  const counts = {
    all: questions.length,
    answered: questions.filter((question) => question.is_answered).length,
    unanswered: questions.filter((question) => !question.is_answered).length,
  };

  const visible = questions
    .filter((question) =>
      filter === "all" ? true : filter === "answered" ? question.is_answered : !question.is_answered,
    );

  const selectFilter = (next: Filter) => {
    setFilter(next);
    const url = new URL(window.location.href);
    if (next === "all") {
      url.searchParams.delete("filter");
    } else {
      url.searchParams.set("filter", next);
    }
    window.history.replaceState(null, "", url);
  };

  return (
    <section aria-labelledby="questions-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b">
        <h2 id="questions-heading" className="pb-3 text-xl font-semibold tracking-tight">
          Questions
        </h2>
        <div role="group" aria-label="Filter questions" className="-mb-px flex gap-5">
          {tabs.map((tab) => {
            const active = filter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                aria-pressed={active}
                onClick={() => selectFilter(tab.value)}
                className={`border-b-2 pb-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  active
                    ? "border-primary font-semibold text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}{" "}
                <span className="tabular-nums text-muted-foreground">{counts[tab.value]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {visible.length > 0 ? (
        <ol className="flex flex-col gap-3">
          {visible.map((question) => (
            <li key={question.id}>
              <QuestionCard
                question={question}
                roomId={roomId}
                canDelete={canModerate}
                canAnswer={canModerate && !question.is_answered}
              />
            </li>
          ))}
        </ol>
      ) : (
        <EmptyState filter={filter} canModerate={canModerate} hasAny={questions.length > 0} />
      )}
    </section>
  );
}

function EmptyState({
  filter,
  canModerate,
  hasAny,
}: {
  filter: Filter;
  canModerate: boolean;
  hasAny: boolean;
}) {
  let text = canModerate
    ? "No questions yet. Share the room so people can start asking."
    : "No questions yet. Yours can be the first.";

  if (hasAny && filter === "unanswered") {
    text = "Nothing waiting. Every question has an answer.";
  } else if (hasAny && filter === "answered") {
    text = "No answers yet.";
  }

  return <p className="py-12 text-center text-muted-foreground">{text}</p>;
}
