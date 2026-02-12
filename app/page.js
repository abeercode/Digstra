//remember abeer pages go in the app folder and UI pieces go in the components folder

import { auth } from "@/auth";
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";
import Image from "next/image";
import LoginButton from "@/components/LoginButton";
import logoutButton from "@/components/LogoutButton";

export default async function Home() {
  const session = await auth();
  
  if (session) {
    return (<>
      <div> welcome {session.user.name}</div>
      <Link href={"/api/auth/signout"}>sign out</Link>
      <LoginButton> </LoginButton>
      <logoutButton></logoutButton>
    </>
    )
  }
  else {
    return (
      <><div>log in here </div>
        <Link href="/api/auth/signin">sign in </Link>
        <LoginButton> </LoginButton>
        <logoutButton></logoutButton>
        </>
        
    )
  }
}
