
"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper() {

const pathName = usePathname();

const segments = pathName.split('/').filter(Boolean); // Filter removes empty strings
    
    const isInsideRoom = segments[0] === "Rooms" && segments.length >= 2;

    if (isInsideRoom) {
        return null;
    }

    return <Footer />;

}