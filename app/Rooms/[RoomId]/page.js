import { notFound } from "next/navigation"; 
import { createClient } from "@/lib/supabase/server";


export default async function RoomId({ params }) {

    const {RoomId} = await params;
    const supabase = await createClient();
   const resolvedParams = await params;

   
    const { data: room, error } = await supabase
        .from('rooms')
.select(`
        name,
        created_at,
        profiles!left (
            full_name
        )
    `)
        .eq('id', RoomId)
        .single();
    if (error || !room) {
        notFound();

}

    return (
        <>
           <div>
            <h1>Welcome to {room.name}</h1>
            <div>
                <p>
                    hosted by: <strong>{room.profiles?.full_name || "Unknown Host"}</strong>
                </p>
                <p>
                    created on: {new Date(room.created_at).toLocaleDateString()}
                </p>
            </div>Room ID: {RoomId}</div>
            
        </>
    )
}