"use client"
import { useState } from "react"
import Image from "next/image";
export default function ChatWrapper({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative w-full h-full flex flex-col justify-end items-end p-4">

            {/* 1. THE CHAT BLOCK */}
            <div
                className={`
                    absolute bottom-4 right-7 z-20 rounded-2xl
                    flex flex-col w-full max-w-[400px] h-[600px] 
                    bg-amber-50 border-2  border-[#945e2c] shadow-[8px_8px_0px_0px_rgba(41,37,36,.5)]
                    transition-all duration-300 ease-out origin-bottom-right
                    ${isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-0 opacity-0 pointer-events-none"}
                `}>

                {/* THE HEADER (Clicking this or an 'X' closes it) */}
                <div
                    onClick={() => setIsOpen(false)}
                    className="bg-[#d9a066] p-2 rounded-t-xl text-blue-950 text-[18px] font-blacktracking-widest flex justify-between items-center px-4 cursor-pointer"
                >
                    <p>Chat <span></span></p>
                    <span className="text-lg whitespace-pre">_  ☐   x</span> 
                </div>

                {/* THE CHAT BODY */}
                <div className="flex-1 overflow-hidden bg-amber-50 rounded-2xl ">
                    {children}
                </div>
            </div>

            {/* 2. THE CHAT BUBBLE (Visible only when closed) */}
            <button
                onClick={() => setIsOpen(true)}
                className={`
                    z-10 w-16 h-16 transition-all duration-300 transform
                    hover:scale-110 active:scale-95
                    ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}
                `}
            >
                {/* Your Pixel Art Bubble Image */}
                <Image
                    src="/chatBubble.png"
                    alt="Chat"
                    className="w-24 h-16 object-contain pixel-art drop-shadow-md"
                    width={0}
                    height={0}
                />
            </button>

            {/* 3. OPTIONAL: Click-away backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-0 bg-transparent"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    )
}