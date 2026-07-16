"use server";

import { createClient } from "@/lib/supabase/server";
import { checkIfOwner, checkIfOwnerOrModerator, findUserIdByEmail } from "./users";
import { revalidatePath } from "next/cache";

export async function getRoomModeratorIds(roomId: string){
    const supabase = await createClient();
    const {data, error} = await supabase.from("room_moderators").select("user_id").eq("room_id", roomId);

    if (error){
        return {error: error.message};
    }

    return {data};
}

export async function getRoomModerators(roomId: string){
    const supabase = await createClient();
    const {data: moderatorRows, error} = await supabase
        .from("room_moderators")
        .select("user_id, created_at")
        .eq("room_id", roomId)
        .order("created_at", {ascending: true});

    if (error){
        return {error: error.message};
    }

    if (!moderatorRows || moderatorRows.length === 0){
        return {data: []};
    }

    const userIds = moderatorRows.map((row) => row.user_id);
    const {data: profiles, error: profilesError} = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", userIds);

    if (profilesError){
        return {error: profilesError.message};
    }

    const data = moderatorRows.map((row) => ({
        user_id: row.user_id,
        email: profiles?.find((profile) => profile.id === row.user_id)?.email ?? "Unknown user",
        created_at: row.created_at,
    }));

    return {data};
}

export async function removeModeratorFromRoom(roomId: string, userId: string){
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) {
        return {error: "Unauthorized"};
    }
    if (!(await checkIfOwner(roomId)).data) {
        return {error: "You are not authorized to remove moderators from this room"};
    }

    const {error} = await supabase
        .from("room_moderators")
        .delete()
        .eq("room_id", roomId)
        .eq("user_id", userId);

    if (error) {
        return {error: error.message};
    }

    revalidatePath(`/room/${roomId}`);
    return {data: {success: "Moderator removed successfully"}};
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