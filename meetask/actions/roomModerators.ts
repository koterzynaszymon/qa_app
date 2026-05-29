"use server";

import { createClient } from "@/lib/supabase/server";

export async function getRoomModeratorIds(roomId: string){
    const supabase = await createClient();
    const {data, error} = await supabase.from("room_moderators").select("user_id").eq("room_id", roomId);

    if (error){
        return {error: error.message};
    }

    return {data};
}