import { auth } from "@/auth";
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const session = await auth();
  if (session) {
    return (<>
      <div> welcome {session.user.name}</div>
      <Link href={"/api/auth/signout"}>sign out</Link>
      
    </>
    )
  }
  else {
    return (
      <><div>log in here </div>
        <Link href="/api/auth/signin">sign in </Link></>
    )
  }
}
