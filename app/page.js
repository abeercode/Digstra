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

      <main className=" p-0 m-0 bg-[url(/anotherInitialBG.png)] min-h-screen box-border flex flex-col items-center justify-center relative" style={{
        imageRendering: 'pixelated',
        height: "610px",
        backgroundSize: 'cover',
        backgroundPosition: 'center',   
        backgroundRepeat: 'no-repeat',
      }}>
         <div className="text-6xl"> Digstra</div>
        <LoginButton> </LoginButton>
      </main>
    )
  }

}