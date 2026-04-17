'use server'

import { auth } from "@/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createRoom(formData) {
    // 1. Get the session first
    const session = await auth();
    
    // 2. Guard Clause: Stop if not logged in
    if (!session?.user) {
        throw new Error("Please log in first!");
    }

    const user = session.user;
    
    // Debugging (Keep these until you confirm the redirect works!)
    console.log("Creating room for:", user.email);

    // 3. Prepare the data
    const supabase = await createClient();
    const nameInput = formData.get('roomName') || "New Study Session";
    const durationInput = formData.get("duration");

    // 4. Database Insert
    const { data: newRoom, error } = await supabase
        .from('rooms')
        .insert([
            {
                name: nameInput,
                host_id: user.id ,
                duration_minutes: parseInt(durationInput)
            }
        ])
        .select()
        .single();

    // 5. Handle Database Errors
    if (error) {
        console.error("Database Insert Error:", error.message);
        throw new Error("Could not create room. Please try again.");
    }
console.log("Room created! ID is:", newRoom.id); // Check your VS Code terminal for this!

if (!newRoom?.id) {
    throw new Error("Room was created but I couldn't get the ID back!");
}

redirect(`/Rooms/${newRoom.id}`); // Ensure 'id' is lowercase to match Supabase
}