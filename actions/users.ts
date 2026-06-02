"use server";

import { createClient } from "@/lib/supabase/server";
import { getRoomOwnerId } from "./rooms";
import { getRoomModeratorIds } from "./roomModerators";

export async function checkIfOwner(roomId: string){
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) {
        return {error: "Unauthorized"};
    }
    const {data: ownerId} = await getRoomOwnerId(roomId);
    return {data: ownerId?.owner_id === user.id};
}

export async function checkIfOwnerOrModerator(roomId: string){
    const supabase = await createClient();
    
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        return {error: "Unauthorized"};
    }

    const {data: ownerId} = await getRoomOwnerId(roomId);
    const {data: moderatorIds} = await getRoomModeratorIds(roomId);
    return {data: ownerId?.owner_id === user.id || moderatorIds?.some((moderator) => moderator.user_id === user.id)};
}

export async function findUserIdByEmail(email: string){
    const supabase = await createClient();
    const {data, error} = await supabase.from("profiles").select("id").eq("email", email).single();
    if (error){
        return {error: error.message};
    }
    return {data: data?.id};
}