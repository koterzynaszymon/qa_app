"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { checkIfOwner } from "./users";

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
    revalidatePath("/dashboard");

    return {data};
}

export async function getRooms() {
    const supabase = await createClient();

    const {data: {user}} = await supabase.auth.getUser();
    if (!user) {
        return {error: "Unauthorized"};
    }

    const {data, error} = await supabase.from("rooms").select("*").eq("owner_id", user.id);

    if (error) {
        return {error: error.message};
    }

    return {data};
}

export async function deleteRoom(id: string) {
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        return {error: "Unauthorized"};
    };

    const {error} = await supabase.from("rooms").delete().eq("id", id).eq("owner_id", user.id);

    if (error) {
        return {error: error.message};
    }

    revalidatePath("/dashboard");

    return {data: {success: "Room deleted successfully"}};
}

export async function updateRoom(id: string, formData: FormData) {
    const { name, description } = formData;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !(await checkIfOwner(id)).data) {
        return { error: "Unauthorized" };
    }

    const { data, error } = await supabase
        .from("rooms")
        .update({
            name,
            description,
        })
        .eq("id", id)
        .eq("owner_id", user.id)
        .select()
        .single();

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/room/${id}`);

    return { data };
}

export async function toggleRoomOpen(id: string, isOpen: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !(await checkIfOwner(id)).data) {
        return { error: "Unauthorized" };
    }

    const { data, error } = await supabase
        .from("rooms")
        .update({ is_open: isOpen })
        .eq("id", id)
        .eq("owner_id", user.id)
        .select()
        .single();

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard");

    return { data };
}

export async function getRoomOwnerId(roomId: string){
    const supabase = await createClient();
    const {data, error} = await supabase.from("rooms").select("owner_id").eq("id", roomId).single();

    if (error){
        return {error: error.message};
    }

    return {data};
}

export async function getRoomIsOpen(roomId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("rooms")
        .select("is_open")
        .eq("id", roomId)
        .single();

    if (error) {
        return { error: error.message };
    }

    return { data: data.is_open };
}