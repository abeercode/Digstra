"use client"
import { useState } from "react"

export default function ChatWrapper({ children }) {


    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative w-full h-full flex flex-col justify-end overflow-hidden">
            {/* The Chat Card */}
            <div
                className={`flex flex-col w-full h-[90%] bg-white border-4 border-stone-800 shadow-[4px_4px_0px_0px_rgba(41,37,36,1)] transition-transform duration-500 ease-in-out
                    ${isOpen ? "translate-y-0" : "translate-y-[calc(100%-44px)]"}`}
            >
                {/* THE BLUE HEADER */}
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-blue-600 p-2 text-white text-[10px] font-black uppercase tracking-widest text-center cursor-pointer hover:bg-blue-500 active:bg-blue-700 transition-colors flex justify-between items-center px-4"
                >
                    <span>{isOpen ? "▼" : "▲"}</span>
                    <span>Expedition Logs</span>
                    <span>{isOpen ? "▼" : "▲"}</span>
                </div>

                {/* THE CHAT BODY (Children) */}
                <div className="flex-1 overflow-hidden">
                    {children}
                </div>
            </div>
        </div>


    )
}