
"use client"
import Link from "next/link"
import LoginButton from "./LoginButton"
import LogoutButton from "./LogoutButton"
import Image from "next/image"

import { signIn } from "next-auth/react"
import { useState } from "react";
import { redirect } from "next/dist/server/api-utils"

export default function NavBar({ session }) {

// bg-blue-950 
    return (
        <>
            <nav className=" gap-1 w-full z-50 absolute p-3 bg-blue-950/60 flex flex-row top-0 left-0 justify-between">
                <div className="flex flex-row pl-12">
                    <Image src="/axe.png" width={60} height={60} className="pixel-art absolute z-0 " alt=""></Image>
                    <div className="flex flex-col pl-13 pt-3 ">
                        <h4 className="text-[24px] text-amber-50">DIGSTRA</h4>
                
                    </div>
                </div>

                {session ? (<>
                   <div className="justify-around gap-16 pr-10 flex text-amber-50">
                        <Link href="/Dashboard" className=" pt-2 text-[22px]" >Dashboard </Link>
                        <Link href="/Rooms" className=" pt-2 text-[22px]"> Session</Link>
                           <Link href="/" className=" pt-2 text-[22px]">About</Link>
                        <LogoutButton ></LogoutButton>

                    </div>
                </>) : (
                    <>
                        <div className="justify-around gap-24 pr-10 flex text-amber-50">
                      <Link href="/" className=" pt-2 text-[22px]"> Home</Link>
                       <Link href="/" className=" pt-2 text-[22px]">About</Link>
                            <button className="text-[21px]" onClick={() => signIn("google", { redirectTo: "/Dashboard" })}>Login</button>
                        </div>
                    </>)}
            </nav>
        </>
    )
}
