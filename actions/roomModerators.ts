"use server";

import { createClient } from "@/lib/supabase/server";
import { checkIfOwnerOrModerator, findUserIdByEmail } from "./users";
import { revalidatePath } from "next/cache";

export async function getRoomModeratorIds(roomId: string){
    const supabase = await createClient();
    const {data, error} = await supabase.from("room_moderators").select("user_id").eq("room_id", roomId);

    if (error){
        return {error: error.message};
    }

    return {data};
}

export async function addModeratorToRoom(roomId: string, email: string){
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) {
        return {error: "Unauthorized"}; 
    }
    if (!(await checkIfOwnerOrModerator(roomId)).data) {
        return {error: "You are not authorized to add moderators to this room"};
    }

    const userId = (await findUserIdByEmail(email)).data;
    if (!userId) {
        return {error: "User not found"};
    }
    
    const {error} = await supabase.from("room_moderators").insert({
        room_id: roomId,
        user_id: userId,
    }).select().single();
    if (error) {
        return {error: error.message};
    }
    revalidatePath(`/room/${roomId}`);
    return {data: {success: "Moderator added successfully"}};
}