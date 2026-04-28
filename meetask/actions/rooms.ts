"use server";

import { createClient } from "@/lib/supabase/server";

interface FormData {
    name: string;
    description: string;
}

export async function createRoom(formData: FormData) {
    const {name, description} = formData;
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) {
        return {error: "Unauthorized"};
    }

    const {data, error} = await supabase.from("rooms").insert({
        name,
        description,
        owner_id: user.id,
    }).select().single();

    if (error) {
        return {error: error.message};
    }

    return {data};
}