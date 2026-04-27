'use client'
import Button from "@/components/Button"
import { createRoom } from "@/app/lib/actions";
import Image from "next/image";
import { useState } from "react";
export default function Rooms() {

    const [isHovered, setIsHovered] = useState(false);
    const [gifKey, setGifKey] = useState(0);

    const handleMouseEnter = () => {
        setGifKey(prev => prev + 1); // force remount
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const options = []
    for (let i = 1; i <= 120; i += 1) {
        options.push(<option value={i} key={i}>{i}</option>);
    }
    return (
        <>
            <Image src="/anotherInitialBG.png" fill alt="" priority className="object-cover object-bottom z-0 pixel-art"></Image>
            <main className="relative z-20 flex flex-col md:flex-row items-center justify-center w-full min-h-screen p-6 gap-12">

                {/* create session card */}
                <div className="group relative w-full max-w-xl bg-amber-50 border-2 border-dashed border-stone-800/30 p-8 hover:-translate-y-1 transition-all">

                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#162456] border-2 border-[#0d1840] px-4 py-1  text-white uppercase ">
                        NEW SESSION
                    </div>

                    <div className="flex flex-col items-center gap-6 mt-4">
                        <div className="text-6xl group-hover:animate-bounce">
                            <Image src="/chestClean.png" width={45} height={45} alt=""
                                className="pixel-art"></Image>

                        </div>

                        {/* form section to create a room */}
                        <div className="w-full">
                            <form action={createRoom}>

                                <p className="text-xs font-black uppercase text-stone-400 mb-1">Session Name</p>

                                <input type="text" placeholder=".NET Final Study..." className="w-full focus:translate-x-1 focus:translate-y-1 bg-white border-2 border-stone-300 p-3 font-mono focus:border-yellow-500 outline-none" />
                                <div name="timerSections" >
                                    <label >set timer</label>

                                    <select name="duration" id="duration" defaultValue="25"
                                        className="w-full  bg-white border-2 border-stone-300 p-4 font-mono text-lg font-bold text-stone-800 
                  focus:shadow-none focus:translate-x-1 focus:translate-y-1 
                 transition-all outline-none cursor-pointer"
                                    ><option value="" disabled>
                                            Select time
                                        </option>{options}</select>
                                </div>

                                <button type="submit" > create a session </button>
                            </form>
                        </div>
                        <button className="w-full bg-stone-800 text-yellow-400 font-bold py-3 hover:bg-stone-700 active:scale-95 transition-all uppercase tracking-tighter">
                            Start Digging
                        </button>
                    </div>
                </div>

                {/* JOIN CARD */}
                <div className="group relative w-full max-w-xl bg-amber-50 border-2 border-dashed border-stone-800/30 p-8  hover:-translate-y-1 transition-all">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#d3f7ad] border-2  border-[#9fc575] px-4 py-1 font-black text-black uppercase italic">
                        Follow Link
                    </div>
                    <div className="flex flex-col items-center gap-6 mt-4">
                        <div className="text-6xl group-hover:rotate-12 transition-transform group-hover:animate-bounce "><Image src="/axe.png" width={23} height={30} alt="" ></Image></div>
                        <div className="w-full">
                            <p className=" text-xs font-black uppercase text-stone-400 mb-1">Tunnel ID</p>
                            <input type="text" placeholder="Enter code..." className="w-full focus:translate-x-1 focus:translate-y-1  bg-white border-2 border-stone-300 p-3 font-mono focus:border-blue-500 outline-none" />
                        </div>
                        <button className="w-full bg-stone-800 text-blue-300 font-bold py-3 hover:bg-stone-700 active:scale-95 transition-all uppercase tracking-tighter">
                            Join Party
                        </button>
                    </div>
                </div>
            </main>








            {/* <div className="h-10 w-full"></div>
            <div> start a session now </div>
            <form action={createRoom}>
                <input type="text" name="roomName" placeholder="Room Name...." ></input>

                <div name="timerSections" >
                    <label >set timer</label>
                    <select name="duration" id="duration" defaultValue="25"><option value="" disabled>
                        Select time
                    </option>{options}</select>
                </div>

                <button type="submit" > create a session </button>
            </form> */}
        </>
    )

}