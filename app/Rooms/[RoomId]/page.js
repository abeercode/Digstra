import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RoomTimer from "@/components/RoomTimer";
import ShareRoom from "@/components/ShareRoom";
import ShareCode from "@/components/ShareCode";
import { auth } from "@/auth";
import RoomChat from "@/components/RoomChat";
import Quiz from "@/components/Quiz";
import Image from "next/image";
import ChatWrapper from "@/components/ChatWrapper";
export const maxDuration = 60;


export default async function RoomPage({ params }) {
    const { RoomId } = await params;
    const supabase = await createClient();
    const session = await auth();
    const currentUserId = session?.user?.id;
    const user = session?.user;
    // const userName = session?.user?.name;
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
    // Inside your Room Page (Server Component)
    const { data: initialMessages } = await supabase
        .from('room_messages')
        .select(`
        *,
        profiles (
            username
        )
    `) // This "Joins" the profiles table
        .eq('room_id', RoomId)
        .order('created_at', { ascending: true });
    if (error || !room) {
        return <div className="p-10 bg-red-100">Database Error: {error.message}</div>;
    }
    //     const SharingLink = () => {
    // navigator.clipboard.writeText(window.location.href)
    //     }
    return (
        <>

            <div className="relative min-h-screen bg-sky-100 overflow-hidden flex flex-col ">

                <div className="absolute inset-0 z-0 opacity-70">

                    <Image src="/anotherInitialBG.png" fill alt="" priority className="object-cover object-bottom z-0 pixel-art"></Image>
                </div>

                {/* top bar */}
                <header className="relative z-10 w-full p-4  border-stone-800 bg-blue-950/60 flex justify-between items-center shadow-md">
                    <div>
                        <h1 className="text-2xl  text-[#f8f2ea] tracking-tighter">

                            <span className=" text-[32px]">✎</span> {room.name}
                        </h1>
                        <p className="text-xs  text-green-50">
                            Leader:<span className="whitespace-pre text-amber-200"> {room.profiles?.full_name || "Unknown"}  </span>
                            | Room ID: <span className="whitespace-pre text-amber-200"> {RoomId} </span>
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <ShareRoom />
                        <ShareCode RoomID={RoomId} />
                    </div>

                </header>

                {/* main */}
                <main className="relative z-10 flex-1 flex flex-row p-6 gap-6 h-[calc(100vh-80px)] ">

                    {/* LEFT SIDE: The Quiz/Knowledge Mine */}
                    <section className=" w-1/4 h-1/2 flex flex-col gap-4 pt-20">
                        <div className="resize both overflow-auto min-w-[250px] min-h-[300px] max-w-[33vw] max-h-[70vh] w-[25vw] h-[50vh] bg-amber-50 border-2 border-dashed border-stone-800/30 p-4 shadow-[4px_4px_0px_0px_rgba(41,37,36,0.5)] flex flex-col">
                            <h3 className="text-sm font-black mb-3 text-amber-900 sticky top-0 bg-amber-50 py-1">
                                QUIZ
                            </h3>
                            <div className="flex-1">
                                <Quiz RoomId={RoomId} user={user} />
                            </div>
                        </div>
                    </section>

                    {/* CENTER: The Timer & Character Focus */}
                    <section className=" flex flex-col items-center justify-center flex-1">
                        <div className="relative group">
                            {/* You can add a glowing effect behind the timer */}
                            {/* <div className="absolute -inset-4 bg-yellow-400/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div> */}

                            <RoomTimer
                                duration={room.duration_minutes}
                                roomId={RoomId}
                                currentUserId={currentUserId}
                                hostId={room.host_id}
                                initialStartedAt={room.started_at}
                                user={user}
                            />
                        </div>
                    </section>

                    {/* RIGHT SIDE: The Expedition Chat */}
                    <section className="w-1/4 flex flex-col">
                        {/* <div className="flex-1 bg-white border-4 border-stone-800 flex flex-col shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] overflow-hidden"> */}

                        <div className="flex-1 overflow-y-auto">
                            <ChatWrapper>
                                <RoomChat
                                    roomId={RoomId}
                                    currentUserId={currentUserId}
                                    initialMessages={initialMessages}
                                    currentUserName={session?.user?.name}
                                />
                            </ChatWrapper>
                        </div>
                        {/* </div> */}
                    </section>

                </main>
            </div>




            {/* <div>
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
                user={user}
            />
            <ShareRoom />
            <RoomChat roomId={RoomId} currentUserId={currentUserId} initialMessages={initialMessages} currentUserName={session?.user?.name} />
            <Quiz RoomId={RoomId} user={user} /> */}
            {/* <ActiveUsers 
    roomId={RoomId} 
    userName={userName} 
    currentUserId={currentUserId} 
/> */}
        </>
    )
}