import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import RoomTimer from "@/components/RoomTimer";

export default async function RoomPage({ params }) {

    const { RoomId } = await params;
    const supabase = await createClient();

    const resolvedParams = await params;
    const p = params;


    //this is also for debugging use
    const { data: room, error } = await supabase
        .from('rooms')
        .select(`
        name,
        created_at,
        duration_minutes,
        profiles!left (
            full_name
        )
    `)
        .eq('id', RoomId)
        .single();
    //end of debugging use
    if (error || !room) {
        return <div className="p-10 bg-red-100">Database Error: {error.message}</div>;

    }

//     const SharingLink = () => {
    
// navigator.clipboard.writeText(window.location.href)


//     }

    return (
        //debugging use
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
            <RoomTimer duration={room.duration_minutes}></RoomTimer>
            <button name="ShareLink" onClick={SharingLink()}>Share the room!</button>
            {/* {handlingTimer(room)} */}
            {/* //end of debugging use */}
        </>

    )
}

