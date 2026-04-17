import { notFound } from "next/navigation"; 
import { createClient } from "@/lib/supabase/server";


export default async function RoomPage({ params }) {

    const {RoomId} = await params;
    const supabase = await createClient();

   const resolvedParams = await params;


   //fetch room data from the server , joined with profiles table
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
return <div className="p-10 bg-red-100">Database Error: {error.message}</div>;

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