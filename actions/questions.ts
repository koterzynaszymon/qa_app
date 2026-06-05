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