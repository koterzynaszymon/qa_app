"use server";

import { createClient } from "@/lib/supabase/server";
import { getRoomIsOpen } from "@/actions/rooms";
import { revalidatePath } from "next/cache";

interface CreateQuestionData {
  roomId: string;
  content: string;
}

export async function createQuestion({ roomId, content }: CreateQuestionData) {
  if (!content.trim()) {
    return { error: "Question cannot be empty" };
  }

  const { data: isOpen, error: roomError } = await getRoomIsOpen(roomId);

  if (roomError) {
    return { error: roomError };
  }

  if (!isOpen) {
    return { error: "This room is closed. New questions are not accepted." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .insert({
      room_id: roomId,
      content: content.trim(),
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/room/${roomId}`);

  return { data };
}

export async function getQuestions(roomId: string, filter: "all" | "answered" | "unanswered" = "all" ) {
  const supabase = await createClient();

  let query = supabase.from("questions").select("*").eq("room_id", roomId)
  
  if (filter === "answered"){
    query = query.eq("is_answered", true);
  }
  if (filter === "unanswered"){
    query = query.eq("is_answered", false);
  }

  const { data, error } = await query.order("created_at", { ascending: true });


  if (error) {
    return {error: error.message};
  }

  return {data};
}

export async function getWeeklyQuestionStats() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: ownedRooms, error: ownedError } = await supabase
    .from("rooms")
    .select("id")
    .eq("owner_id", user.id);
  if (ownedError) {
    return { error: ownedError.message };
  }

  const { data: moderatedRows, error: moderatedError } = await supabase
    .from("room_moderators")
    .select("room_id")
    .eq("user_id", user.id);
  if (moderatedError) {
    return { error: moderatedError.message };
  }

  const roomIds = Array.from(
    new Set([
      ...(ownedRooms ?? []).map((room) => room.id),
      ...(moderatedRows ?? []).map((row) => row.room_id),
    ]),
  );

  const daily = [] as { key: string; label: string; count: number }[];
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    daily.push({
      key: day.toISOString().slice(0, 10),
      label: day.toLocaleDateString("en-US", { weekday: "short" }),
      count: 0,
    });
  }

  if (roomIds.length === 0) {
    return { data: { total: 0, daily } };
  }

  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const { data: questions, error } = await supabase
    .from("questions")
    .select("created_at")
    .in("room_id", roomIds)
    .gte("created_at", since.toISOString());

  if (error) {
    return { error: error.message };
  }

  for (const question of questions ?? []) {
    const key = new Date(question.created_at).toISOString().slice(0, 10);
    const bucket = daily.find((day) => day.key === key);
    if (bucket) {
      bucket.count++;
    }
  }

  const total = daily.reduce((sum, day) => sum + day.count, 0);

  return { data: { total, daily } };
}

export async function deleteQuestion(questionId: string, roomId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", questionId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/room/${roomId}`);

  return { data: { success: "Question deleted successfully" } };
}