
"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function NavbarWrapper({ session }) {

const pathName = usePathname();

const segments = pathName.split('/').filter(Boolean); // Filter removes empty strings
    
    const isInsideRoom = segments[0] === "Rooms" && segments.length >= 2;

    if (isInsideRoom) {
        return null;
    }

    return <NavBar session={session} />;

}