/* eslint-disable jsx-a11y/alt-text */
import Link from "next/link"
import LoginButton from "./LoginButton"
import LogoutButton from "./LogoutButton"
import Image from "next/image"


export default function NavBar({ session }) {


    return (
        <>
            <nav className="  justify-around gap-4 w-full z-50 absolute p-3  bg-transparent flex flex-row top-0 left-0">
                <div className="flex flex-row">
                    <Image src="/axe.png" width={80} height={80} className="pixel-art" alt=""></Image>
                    <h4 className="text-[30px] text-[#070738]">Digstra</h4>
                </div>

                {session ? (<>
                    <div className="gap-4 flex">
                        <Link href="/Dashboard">Dashboard </Link>
                        <Link href="/Rooms"> Session</Link>
                        <LogoutButton></LogoutButton>

                    </div>
                </>) : (
                    <>
                        <div className="justify-around gap-4 flex">
                            <Link href="/"> Home</Link>
                            <LoginButton> login</LoginButton>
                        </div>
                    </>)}
            </nav>

        </>

    )
}
