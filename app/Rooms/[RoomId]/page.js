import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RoomTimer from "@/components/RoomTimer";
import ShareRoom from "@/components/ShareRoom";
import { auth } from "@/auth";

import RoomChat from "@/components/RoomChat";



// import ActiveUsers from "@/components/ActiveUsers";
export default async function RoomPage({ params }) {

    const { RoomId } = await params;
    const supabase = await createClient();
    const session = await auth();
    const currentUserId = session?.user?.id;
    // const userName = session?.user?.name;
    // const p = params;

    const { data: room, error } = await supabase
        .from('rooms')
        .select(`
        name,
        created_at,
        host_id,
        duration_minutes,
        expires_at,
        started_at,
        is_finished,
        profiles!left (
            full_name
        )
    `)
        .eq('id', RoomId)
        .single();
    if (room?.is_finished) {
        redirect(`/Rooms/${RoomId}/summary`);
    }

    if (error || !room) {
        return <div className="p-10 bg-red-100">Database Error: {error.message}</div>;
    }

    //     const SharingLink = () => {
    // navigator.clipboard.writeText(window.location.href)
    //     }
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
            <RoomTimer
                duration={room.duration_minutes}
                roomId={RoomId}
                currentUserId={currentUserId}
                hostId={room.host_id}
                initialStartedAt={room.started_at}
            />
            <ShareRoom />
            <RoomChat roomId={RoomId} currentUserId={currentUserId} initialMessages={[]}/>
            {/* <ActiveUsers 
    roomId={RoomId} 
    userName={userName} 
    currentUserId={currentUserId} 
/> */}
            {/* {handlingTimer(room)} */}
            {/* //end of debugging use */}
        </>
    )
}