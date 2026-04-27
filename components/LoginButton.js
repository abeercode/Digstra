"use client"
import { signIn } from "next-auth/react"
import { useState } from "react";

export default function LoginButton() {
    //signIn("google") to skip the default page where it shows the google provider

    const [hover, setHover] = useState(false);

    return <button
        onClick={() => signIn("google", { redirectTo: "/Dashboard" })}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="w-52 h-20 text-blue-900 font-bold bg-contain text-[20px] pixel-art" style={{
            backgroundImage: `url(${hover ? "yellowBtnHoverWShodw.png" : "yellowBtn.png"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }}


    > ⛏ Start Digging</button>
}