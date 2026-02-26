import Link from "next/link"
import LoginButton  from "./LoginButton"
import LogoutButton from "./LogoutButton"


export default function NavBar({ session }) {


    return (
        <>
            <nav className="  justify-around gap-4 w-full z-50 absolute p-3  bg-transparent flex flex-row top-0 left-0">
                <nav className="gap-1.5"> logo </nav>
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
