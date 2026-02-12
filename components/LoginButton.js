"use client"
import { signIn } from "next-auth/react"
 
export default function LoginButton() {
//signIn("google") to skip the default page where it shows the google provider
return <button onClick={() => signIn("google", { redirectTo: "/Dashboard" })}> Sign In with Google</button>
} 