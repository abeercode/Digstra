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
        <div className=" relative min-h-screen overflow-hidden bg-sky-200 flex">


          <Image src="/anotherInitialBG.png" fill alt="" priority className="object-cover object-bottom z-0 pixel-art"></Image>
          {/* <div className="absolute inset-0 bg-black/10 z-10" /> */}
          <main className="z-20 relative max-w-7xl mx-auto h-screen flex flex-1 justify-center justify-items-center text-center ">
            <div className="flex flex-row justify-content-center w-full p-20 gap-15 relative">
              <div id="right" className="flex-1 flex flex-col text-left  justify-center items-center">
                <div id="texts" className="flex flex-col max-w-xl w-full text-left">
                  <div className="text-4xl pb-10 text-left">Unearth Your Potential !</div>
                  <p className="text-2xl text-left pb-3">
                    Start digging, Join a study room and turn your focus into treasure</p>
                </div>
                <div id="loginBtn" className="flex items-center justify-center">
                <LoginButton></LoginButton>
                </div>
              </div>

              <div className="flex-1"> </div>
              <div id="left" className=" right-[10%] bottom-[32%] z-20 flex item-end gap-3 absolute">

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


//initial 
// <div className=" bg-[url('/anotherInitialBG.png')] relative min-h-screen flex items-center justify-center overflow-hidden"
//     style={{
//       imageRendering: 'pixelated',
//       height: "610px",
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//       backgroundRepeat: 'no-repeat',
//     }}>
//     {/* <div className="absolute inset-0 bg-black/10 z-10" /> */}
//     <main className="z-20">
//       <div className="flex flex-row justify-content-center w-full p-20 gap-15 relative">

//         <div id="right" className="flex-1 justify-center items-center text-center ">

//           <div id="texts" className="flex`">

//             <div className="text-4xl pb-10"> Unearth Your Potential !</div>
//             <p className="text-2xl">
//               Start digging, Join a study room and turn your focus into treasure</p>
//           </div>
//           <LoginButton></LoginButton>
//         </div>

//         <div id="left" className="flex bottum-0 right-20 gap-3 pt-14 absolute">

//           <Image src="/cuteInitial.png" height={0} width={0} alt="" className="pt-3 w-44 h-auto pixel-art object-contain"></Image>
//           <Image src="/chestClean.png" height={0} width={0} alt="" className="w-30 h-auto object-contain pixel-art pt-40"></Image>
//         </div>
//       </div>
//     </main>
//   </div>