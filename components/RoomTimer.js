"use client"
import { useState, useRef, useEffect } from "react";
import { updateRoomStatus } from "@/app/lib/actions";
import { useRouter } from "next/navigation";

export default function RoomTimer({ duration, roomId }) {
    const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [isActive, setIsActive] = useState(false);
    const timerRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1); // FIXED: subtract 1 second, not 60
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);

    const handleFinishSession = async () => {
        console.log("Calling updateRoomStatus for ID:", roomId);
        try {
            const result = await updateRoomStatus(roomId); 
            console.log("Database Response:", result);
            
            if (result.success) {
                router.push(`/Rooms/${roomId}/summary`); 
            } else {
                alert("Database update failed. Check console.");
            }
        } catch (e) {
            console.error("Critical Error during finish:", e);
        }
    };

    useEffect(() => {
        // Change this to <= 0 to be safe
        if (timeLeft <= 0 ) {
            console.log("TIMER REACHED ZERO - Triggering update...");
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsActive(false);
            handleFinishSession();
        }
    }, [timeLeft, isActive]);



    const formatTime = (time) => {
        const minutes = Math.floor(Math.max(0, time) / 60);
        const seconds = Math.max(0, time) % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (

<>
<h1 className="text-7xl  font-bold text-blue-600">
                {formatTime(timeLeft)}
            </h1>
            {/* Control Buttons */}
            <div className="flex gap-4">
                <button 
                    onClick={() => setIsActive(!isActive)}
                    className={`px-6 py-2 rounded-full font-bold text-white ${isActive ? 'bg-red-500' : 'bg-green-500'}`}
                >
                    {isActive ? "Pause" : "Start"}
                </button>
                </div>
</>)


}