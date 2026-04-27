"use client"
import { signOut } from "next-auth/react"
import { redirect } from "next/dist/server/api-utils"
 
export default function LogoutButton() {
    //"If you want the user to be redirected somewhere else after sign in (.i.e /dashboard), 
    // you can do so by passing the target URL as redirectTo in the sign-in options."
    //source : "https://authjs.dev/getting-started/session-management/login" 
  return <button className="text-[22px]" onClick={() => signOut()}>log out</button>
}