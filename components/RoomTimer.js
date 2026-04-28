"use client"
import { useState, useEffect, useMemo } from "react";
import { updateRoomStatus, startRoomTimer } from "@/app/lib/actions";
import { useRouter } from "next/navigation";
import { client } from "@/lib/supabase/client";
import { addPoints } from "@/app/lib/actions";
export default function RoomTimer({ duration, roomId, currentUserId, hostId, initialStartedAt, user }) {

    // const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [startedAt, setStartedAt] = useState(initialStartedAt);
    const [timeLeft, setTimeLeft] = useState(duration * 60);
    const router = useRouter();
    const supabase = useMemo(() => client(), []);

    // to check if the user is the host 
    const isHost = hostId === currentUserId;
    // i don't even know what hasmounted do but at least it solve the issue lol
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);


    // more like listner which listen for the moment the host clicks "Start"
    useEffect(() => {
        const channel = supabase
            .channel(`room_timer_${roomId}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
                (payload) => {
                    if (payload.new.started_at) {
                        setStartedAt(payload.new.started_at);
                    }
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [roomId, supabase]);

    // the ticker, recalculates remaining time every second

    //The Math: Remaining Time = Total Duration - (Now - StartTime)
    useEffect(() => {
        if (!startedAt) return;

        const interval = setInterval(() => {
            const startTime = new Date(startedAt).getTime();
            const now = new Date().getTime();
            const elapsedSeconds = Math.floor((now - startTime) / 1000);
            const remaining = (duration * 60) - elapsedSeconds;

            if (remaining <= 0) {
                setTimeLeft(0);
                clearInterval(interval);

                // and then redirect users to summary page
                console.log("Timer finished! Redirecting...");
                router.push(`/Rooms/${roomId}/summary`);

                // Only the host needs to tell the database to mark it as finished
                if (isHost) {
                    handleFinishSession();
                }
            } else {
                setTimeLeft(remaining);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [startedAt, duration, isHost, roomId, router]);


    const handleStart = async () => {
        try {

            // This makes the timer start moving the millisecond it clicked
            const now = new Date().toISOString();
            setHasMounted(true);
            setStartedAt(now);

            //call startRoomTimer to update the table
            await startRoomTimer(roomId);
        } catch (e) {
            console.error("Failed to start timer:", e);
            setStartedAt(null);
        }
    };


    const handleFinishSession = async () => {
        try {
            const result = await updateRoomStatus(roomId);
            if (result.success) {
                router.push(`/Rooms/${roomId}/summary`);
            }
        } catch (e) {
            console.error("Critical Error during finish:", e);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(Math.max(0, time) / 60);
        const seconds = Math.max(0, time) % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    useEffect(() => {

        if (!currentUserId) return; //if the user not logged in then return | to not crush out the database 

        addPoints(currentUserId, 1)

        const interval = setInterval(() => {
            addPoints(currentUserId, 1)
            console.log("5 min passed 1 point added")

        }, 300000);
        return () => clearInterval(interval) // after the first run , tell react to clean the previous interval

    }, [currentUserId])  // run everytime when user change | which means once 

    // from what i understand, it render the initial duration from the server, and then the system will render the actual remaining duration 
    if (!hasMounted) {
        return <h1 className="text-7xl font-bold text-blue-600">{formatTime(duration * 60)}</h1>;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    // useEffect(() => {
    //     // Change this to <= 0 to be safe
    //     if (timeLeft <= 0) {
    //         console.log("TIMER REACHED ZERO - Triggering update...");
    //         // eslint-disable-next-line react-hooks/set-state-in-effect
    //         setIsActive(false);
    //         handleFinishSession();
    //     }
    // }, [timeLeft, isActive]);

    return (
        <>
            <h1 className="text-7xl  font-bold text-blue-600">
                {formatTime(timeLeft)}
            </h1>
            {/* Control Buttons */}
            <div className="flex gap-4">
                {isHost && !startedAt && (
                    <button
                        onClick={handleStart}
                        className="px-8 py-3 bg-green-500 hover:bg-green-600 rounded-full font-bold text-white transition-all shadow-lg"
                    >
                        Start Session
                    </button>
                )}
                {startedAt && (
                    // //animate-pulse
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                        Session Live
                    </span>
                )}
            </div>
        </>)
}