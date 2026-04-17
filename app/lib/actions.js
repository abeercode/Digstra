'use server'

import { auth } from "@/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createRoom(formData) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Please log in first!");
    }

    const user = session.user;
    //debugging use
    console.log("Creating room for:", user.email);

    const supabase = await createClient();
    const nameInput = formData.get('roomName') || "New Study Session";
    const durationInput = formData.get("duration");

    // database Insert
    const { data: newRoom, error } = await supabase
        .from('rooms')
        .insert([
            {
                name: nameInput,
                host_id: user.id,
                duration_minutes: parseInt(durationInput)
            }
        ])
        .select()
        .single();

    if (error) {
        console.error("Database Insert Error:", error.message);
        throw new Error("Could not create room. Please try again.");
    }
    console.log("Room created! ID is:", newRoom.id); // Check your VS Code terminal for this!

    if (!newRoom?.id) {
        throw new Error("Room was created but I couldn't get the ID back!");
    }

    redirect(`/Rooms/${newRoom.id}`);
}



//another action that handle when the session is ended and update the needed columns
export async function updateRoomStatus(roomId) {


    const supabase = await createClient();
    const { error } = await supabase
        .from('rooms')
        .update({ is_finished: true }) // Make sure you added this column to Supabase!
        .eq('id', roomId);

    if (error) {
        console.error("Error updating room status:", error.message);
        return { success: false };
    }

    return { success: true };
}

