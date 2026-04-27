'use client'

import { useState } from "react";

export default function NiceButton({text, func}) {
const [hover, setHover] = useState(false);
    return (
        <>
            <button 
              onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
            className="w-52 h-20 text-blue-900 font-bold bg-contain text-[20px] pixel-art hover:translate-x-1 hover:translate-y-1" style={{
                backgroundImage: `url(${hover ? "yellowBtnHoverWOShodw.png" : "yellowBtn.png"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
                onClick={func}>
                {text}
            </button>
        </>)
}