"use client"
import { useState, useRef, useEffect } from "react";
import { updateRoomStatus } from "@/app/lib/actions";
import { useRouter } from "next/navigation";

export default function RoomTimer({ duration, roomId, currentUserId, hostId }) {
    // const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [isActive, setIsActive] = useState(false);
    const timerRef = useRef(null);
    const router = useRouter();

    // to check if the user is the host 
   const isHost = hostId === currentUserId;

    // i don't even know what hasmounted do but at least it solve the issue lol
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);

    //this to save the timer in local storage instead then resetting every time the website is refreshed
    const storageKey = `timer_${roomId}`;

    const [timeLeft, setTimeLeft] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(storageKey);
            return saved !== null ? parseInt(saved) : duration * 60;
        }
        return duration * 60;
    });
    // this useEffect saves the time to the browser every time the clock changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(storageKey, timeLeft.toString());
        }
    }, [timeLeft, storageKey]);

    //the segment that makes the code actually move 
    useEffect(() => {
        let interval;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {

                        clearInterval(interval)
                        setIsActive(false)
                        localStorage.removeItem(storageKey);

                        handleFinishSession();
                        return 0;
                    } return prevTime - 1;
                });
            }, 1000)

        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, storageKey]);

    const handleFinishSession = async () => {

        try {
            const result = await updateRoomStatus(roomId);

            if (result.success) {
                localStorage.removeItem(storageKey);
                router.push(`/Rooms/${roomId}/summary`);
            }
        } catch (e) {
            console.error("Critical Error during finish:", e);
        }
    };
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

    const formatTime = (time) => {
        const minutes = Math.floor(Math.max(0, time) / 60);
        const seconds = Math.max(0, time) % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // this runs at the first when the browser is refreshed before fetching the data from localStorage
    if (!hasMounted) {
        return (
            <h1 className="text-7xl font-bold text-blue-600">
                {formatTime(duration * 60)}
            </h1>
        )
    }
    return (
        <>
            <h1 className="text-7xl  font-bold text-blue-600">
                {formatTime(timeLeft)}
            </h1>
            {/* Control Buttons */}
            <div className="flex gap-4">
                {isHost && (<button
                    onClick={() => setIsActive(!isActive)}
                    className={`px-6 py-2 rounded-full font-bold text-white ${isActive ? 'bg-red-500' : 'bg-green-500'}`}
                >
                    {isActive ? "Pause" : "Start"}
                </button>)}
            </div>
        </>)
}