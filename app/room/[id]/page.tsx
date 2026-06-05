import { getQuestions } from "@/actions/questions";
import { getRoomModeratorIds } from "@/actions/roomModerators";
import { getRoomIsOpen, getRoomOwnerId } from "@/actions/rooms";
import CreateQuestionDialog from "@/components/room/create-question-dialog";
import ShareThroughQrcodeDialog from "@/components/room/share-through-qrcode-dialog";
import RoomSidebar from "@/components/room/sidebar";
import { QuestionsListSkeleton } from "@/components/room/room-page-skeleton";
import QuestionCard from "@/components/room/ui/question-card";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function RoomActions({ roomId }: { roomId: string }) {
  const { data: isRoomOpen } = await getRoomIsOpen(roomId);

  return (
    <div className="flex flex-wrap gap-2">
      <CreateQuestionDialog roomId={roomId} isRoomOpen={isRoomOpen ?? true} />
      <ShareThroughQrcodeDialog roomId={roomId} />
    </div>
  );
}

function RoomActionsSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
      <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />
    </div>
  );
}

async function QuestionsList({
  id,
  filter,
}: {
  id: string;
  filter: "all" | "answered" | "unanswered";
}) {
  const roomId = id;
  const { data: questions, error } = await getQuestions(roomId, filter);

  const { data: ownerId } = await getRoomOwnerId(roomId);
  const { data: moderatorIds } = await getRoomModeratorIds(roomId);
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const isOwnerOrModerator =
    currentUser?.id === ownerId?.owner_id ||
    moderatorIds?.some((moderator) => moderator.user_id === currentUser?.id);

  if (error) {
    return <div className="p-4">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {questions && questions.length > 0 ? (
        questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            roomId={roomId}
            canDelete={!!isOwnerOrModerator}
            canAnswer={!!isOwnerOrModerator && !question.is_answered}
          />
        ))
      ) : (
        <p className="text-muted-foreground text-center mt-8">
          No questions yet. Be the first to ask!
        </p>
      )}
    </div>
  );
}

export default async function RoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ filter: "all" | "answered" | "unanswered" }>;
}) {
  const { id } = await params;
  const { filter } = await searchParams;

  return (
    <div className="flex flex-col md:flex-row w-full flex-1">
      <RoomSidebar roomId={id} filter={filter} />
      <div className="flex-1 p-4 min-w-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
          <h1 className="text-2xl font-bold">Questions</h1>
          <Suspense fallback={<RoomActionsSkeleton />}>
            <RoomActions roomId={id} />
          </Suspense>
        </div>
        <Suspense key={filter} fallback={<QuestionsListSkeleton />}>
          <QuestionsList id={id} filter={filter} />
        </Suspense>
      </div>
    </div>
  );
}
