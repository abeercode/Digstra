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
    try {
        const supabase = await createClient();
        
        // LOG 1: Check if the function starts
        console.log("Checking Room ID:", roomId);

        const { data, error } = await supabase
            .from('rooms')
            .update({ 
                is_finished: true,
                expires_at: new Date().toISOString() 
            })
            .eq('id', roomId) // Ensure roomId is exactly what's in the DB
            .select();

        // LOG 2: Check for errors
        if (error) {
            console.error("SUPABASE UPDATE ERROR:", error.message);
            return { success: false, error: error.message };
        }

        // LOG 3: Check if any row was actually found
        if (!data || data.length === 0) {
            console.error("UPDATE FAILED: No room found with that ID.");
            return { success: false };
        }

        console.log("SUCCESS: Room marked as finished!");
        return { success: true };

    } catch (err) {
        console.error("CRITICAL SERVER ERROR:", err);
        return { success: false };
    }
}

