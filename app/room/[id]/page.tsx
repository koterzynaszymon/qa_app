import { getQuestions } from "@/actions/questions";
import { getRoomModeratorIds } from "@/actions/roomModerators";
import { getRoom } from "@/actions/rooms";
import QuestionComposer from "@/components/room/question-composer";
import QuestionList from "@/components/room/question-list";
import RoomRealtime from "@/components/room/room-realtime";
import RoomSidebar from "@/components/room/sidebar";
import { QuestionsListSkeleton } from "@/components/room/room-page-skeleton";
import { Wordmark } from "@/components/wordmark";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Filter = "all" | "answered" | "unanswered";

async function Questions({
  roomId,
  filter,
  canModerate,
}: {
  roomId: string;
  filter: Filter;
  canModerate: boolean;
}) {
  const { data: questions, error } = await getQuestions(roomId, "all");

  if (error) {
    return (
      <p className="py-10 text-destructive">
        Questions couldn&apos;t be loaded: {error}
      </p>
    );
  }

  const numbered = (questions ?? []).map((question, index) => ({
    ...question,
    number: index + 1,
  }));

  return (
    <>
      <RoomRealtime
        roomId={roomId}
        questionIds={numbered.map((question) => question.id)}
      />
      <QuestionList
        questions={numbered}
        roomId={roomId}
        initialFilter={filter}
        canModerate={canModerate}
      />
    </>
  );
}

export default async function RoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ filter?: Filter }>;
}) {
  const { id } = await params;
  const { filter } = await searchParams;

  const { data: room } = await getRoom(id);
  if (!room) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: moderatorIds } = await getRoomModeratorIds(id);

  const isOwner = !!user && user.id === room.owner_id;
  const canModerate =
    isOwner ||
    (!!user && !!moderatorIds?.some((moderator) => moderator.user_id === user.id));
  const isOpen = room.is_open ?? true;

  return (
    <div className="grid w-full flex-1 md:grid-cols-[19rem_1fr]">
      <RoomSidebar
        room={{ ...room, is_open: isOpen }}
        isOwner={isOwner}
        canModerate={canModerate}
        brand={!user ? <Wordmark /> : null}
        stickyOffset={!!user}
      />
      <main className="min-w-0 px-4 pb-16 pt-6 sm:px-8 md:pt-10">
        <div className="mx-auto max-w-3xl">
          <QuestionComposer roomId={id} isRoomOpen={isOpen} />
          <Suspense fallback={<QuestionsListSkeleton />}>
            <Questions
              roomId={id}
              filter={filter ?? "all"}
              canModerate={canModerate}
            />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
