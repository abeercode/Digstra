/* eslint-disable jsx-a11y/alt-text */
import Link from "next/link"
import LoginButton from "./LoginButton"
import LogoutButton from "./LogoutButton"
import Image from "next/image"


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
                    <div className="gap-4 flex  text-amber-50" >
                        <Link href="/Dashboard" >Dashboard </Link>
                        <Link href="/Rooms"> Session</Link>
                        <LogoutButton></LogoutButton>

                    </div>
                </>) : (
                    <>
                        <div className="justify-around gap-4 flex  text-amber-50">
                            <Link href="/"> Home</Link>
                            {/* <LoginButton> login</LoginButton> */}
                        </div>
                    </>)}
            </nav>

        </>

    )
}
