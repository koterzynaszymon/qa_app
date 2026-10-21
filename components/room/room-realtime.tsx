"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function RoomRealtime({
  roomId,
  questionIds,
}: {
  roomId: string;
  questionIds: string[];
}) {
  const router = useRouter();

  const questionIdsRef = useRef(questionIds);
  questionIdsRef.current = questionIds;

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "questions", filter: `room_id=eq.${roomId}` },
        () => router.refresh(),
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "questions", filter: `room_id=eq.${roomId}` },
        () => router.refresh(),
      )

      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "questions" },
        (payload) => {
          const deletedId = (payload.old as { id?: string }).id;
          if (deletedId && questionIdsRef.current.includes(deletedId)) {
            router.refresh();
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rooms", filter: `id=eq.${roomId}` },
        () => router.refresh(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, router]);

  return null;
}
