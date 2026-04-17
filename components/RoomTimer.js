
"use client"
import { useState, useRef, useEffect } from "react";
export default function RoomTimer({ duration }) {

    const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [isActive, setIsActive] = useState(false);



    const timerRef = useRef(null);
    const handleStart = () => {
        setIsActive(true);
    }


    //this section-function handle the time countdown and ensure that i won't countdown if the time left is 0
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else {
            // Stop the ticking if paused or time hits zero
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);
    //  return <h1>{duration}</h1>

    const formatTime =(time) =>{
        const minutes= Math.floor(time/60);
        const seconds = time%60;
        return  `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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