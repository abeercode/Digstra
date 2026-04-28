
'use client'
import { useState } from "react"
export default function ShareCode({RoomID}) {
    const [copied, setCopied] = useState(false);

    const SharingCode = () => {
        navigator.clipboard.writeText(RoomID)
        setCopied(true);
        // the function waits for 2 seconds and the execute it  
        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }

    return (
        <>
            <button className="px-6 py-2 rounded-full " onClick={SharingCode}>share the room!</button>

            {copied && (
                <div className="absolute left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-3 rounded shadow-lg animate-fade-in">
                    Code copied!
                </div>
            )}

        </>

    )
}