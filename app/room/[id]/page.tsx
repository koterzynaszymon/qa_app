import { getQuestions } from "@/actions/questions";
import { getRoomModeratorIds } from "@/actions/roomModerators";
import { getRoomIsOpen, getRoomOwnerId } from "@/actions/rooms";
import Loading from "@/app/(protected)/dashboard/loading";
import CreateQuestionDialog from "@/components/room/create-question-dialog";
import ShareThroughQrcodeDialog from "@/components/room/share-through-qrcode-dialog";
import RoomSidebar from "@/components/room/sidebar";
import QuestionCard from "@/components/room/ui/question-card";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

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
  const { data: isRoomOpen } = await getRoomIsOpen(id);

  return (
    <div className="flex flex-col md:flex-row w-full flex-1">
      <RoomSidebar roomId={id} filter={filter} />
      <div className="flex-1 p-4 min-w-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
          <h1 className="text-2xl font-bold">Questions</h1>
          <div className="flex flex-wrap gap-2">
            <CreateQuestionDialog roomId={id} isRoomOpen={isRoomOpen ?? true} />
            <ShareThroughQrcodeDialog roomId={id} />
          </div>
        </div>
        <Suspense key={filter} fallback={<Loading />}>
          <QuestionsList id={id} filter={filter} />
        </Suspense>
      </div>
    </div>
  );
}
