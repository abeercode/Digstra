'use server'


import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
// no need for default export for actions, only components 
export async function createRoom(formData) {

    const supabase = await createClient();
    roomName = formData.get();
    // get the user data
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("please log in first!");
    const nameInput = formData.get('roomName') || "New Study Session";

    // and then insert the name into the database 
    const { data: newRoom, error } = await supabase
        .from('rooms')
        .insert([
            {
                name: formData.get('roomName') || "New Study Session",
                host_id: user.id
            }
        ])
        .select()
        .single();

    if (error) {
        console.error("Database Insert Error:", error.message);
        throw new Error(error.message);
    }
    // lastly redirect the user to the new room 
    redirect(`/Rooms/${newRoom.id}`);


}