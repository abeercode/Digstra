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
        className="w-30 h-12 text-blue-900 font-bold bg-contain text-[24px]" style={{
            backgroundImage: `url(${hover ? "yellowBtnHoverWShodw.png" : "yellowBtn.png"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        }}


    >Login</button>
}