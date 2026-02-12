//remember abeer pages go in the app folder and UI pieces go in the components folder
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import Dashboard from "./Dashboard/page";


export default async function Home() {
  const session = await auth();
  if (session) {

    redirect('/Dashboard')
}
  else {
    return (
      <><div>log in here </div>
        <LoginButton> </LoginButton>
      </>)
  }
}
