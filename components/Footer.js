import Image from "next/image"
import Link from "next/link"


export default function Footer() {

    return (
        <>
            <main className=" p-0 m-0 bg-[#422c1f] min-h-[33vh] box-border flex flex-col items-center justify-center relative" style={{
                imageRendering: 'pixelated',
                height: "50px",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
                <p>©2026 abeercode all right reserved </p>
                <div className="flex flex-row gap-2">
                    <Image src="/GitHubLogo.png" height={30} width={30} alt=""></Image>
                     <Link href="https://github.com/abeercode">    github</Link>
                </div>
            </main>
        </>
    )
}