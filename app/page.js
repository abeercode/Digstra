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
      <>

        <div className=" bg-[url('/anotherInitialBG.png')] relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{
            imageRendering: 'pixelated',
            height: "610px",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}>
          {/* <div className="absolute inset-0 bg-black/10 z-10" /> */}
          <main className="z-20">
            <div className="flex flex-row justify-content-center w-full p-20 gap-15 relative">

              <div id="right" className="flex-1 justify-center items-center text-center ">

                <div className="text-4xl pb-10"> Unearth Your Potential!</div>
                <p className="text-xl">
                  Start digging, Join a study room and turn your focus into treasure</p>
                  <LoginButton></LoginButton>
              </div>
              <div id="left" className="flex-1 flex justify-center flex-row gap-3 pt-14">
                <Image src="/cuteInitial.png" height={0} width={0} alt="" className="pt-3 w-44 h-auto pixel-art object-contain"></Image>
                <Image src="/chestClean.png" height={0} width={0} alt="" className="w-30 h-auto object-contain pixel-art pt-40"></Image>
              </div>
            </div>

          </main>
        </div>

      </>
    )
  }

}