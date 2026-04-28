
'use client'
import { useState } from "react"
export default function ShareRoom() {
    const [copied, setCopied] = useState(false);

    const SharingLink = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true);
        // the function waits for 2 seconds and the execute setCopied 
        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }

    return (
        <>
            <button className="px-6 py-2 rounded-full text-[#e6fab9] " onClick={SharingLink}>Share link</button>
            {copied && (
                <div className="z-50 fixed top-1/4 left-1/2  transform -translate-x-1/2 -translate-y-1/2 bg-gray-800/80 text-white text-xs py-1 px-3 rounded shadow-lg animate-fade-in">
                    Link copied!
                </div>
            )}

        </>

    )
}