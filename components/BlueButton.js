'use client'

import { useState } from "react";

export default function BlueButton({text, func}) {
const [hover, setHover] = useState(false);
    return (
        <>
            <button 
              onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
            className="w-44 h-22 text-amber-50 font-bold bg-contain text-[20px] pixel-art hover:translate-x-1 hover:translate-y-1" style={{
                backgroundImage: `url(${hover ? "/blueBtnHover.png" : "/blueBtn.png"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
                onClick={func}>
                {text}
            </button>
        </>)
}