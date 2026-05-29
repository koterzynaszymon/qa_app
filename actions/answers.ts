"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CreateAnswerData {
  questionId: string;
  answer: string;
}

export async function createAnswer({questionId, answer}: CreateAnswerData) {
  if (!answer.trim()) {
    return { error: "Answer cannot be empty" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .update({
      answer: answer.trim(),
      is_answered: true,
    })
    .eq("id", questionId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/room/${data.room_id}`);

  return { data };
}

export async function deleteAnswer({
  questionId,
  roomId,
}: {
  questionId: string;
  roomId: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("questions")
    .update({
      answer: null,
      is_answered: false,
    })
    .eq("id", questionId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/room/${roomId}`);

  return { data: { success: "Answer deleted successfully" } };
}