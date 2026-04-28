import { auth } from "@/auth";
import { createClient } from "@/lib/supabase/server";

import BlueButton from "@/components/BlueButton";
import YellowButton from "@/components/YellowButton";

import Image from "next/image";
export default async function SummaryPage({ params }) {
   
    const { RoomId } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    //fetch the room details  
    const supabase = await createClient();
    const { data: room } = await supabase
        .from('rooms')
        .select('name, duration_minutes')
        .eq('id', RoomId)
        .single();

    const { data: scores, error: error } = await supabase
        .from("quiz_scores")
        .select("score")
        .eq("room_id", RoomId)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    let pointsFromRoom= (room?.duration_minutes ||0)

    let totalPoints =0
    let quizPoints= 0
    if (scores) {
        for (let i = 0; i < scores.length; i++) {
            quizPoints += parseInt(scores[i]["score"])
        }
    }
    totalPoints= quizPoints+pointsFromRoom
       
    return (


  <div className="min-h-screen bg flex flex-col items-center p-8 relative overflow-hidden">
     <div className="absolute inset-0 z-0 opacity-30">
     <Image src="/BGWOGround.png" fill alt="" priority className="object-cover object-bottom z-0 pixel-art"></Image>
            </div>
            {/* Background Decor - Floating pixel stars or lanterns */}
            {/* MAIN CONTAINER: The Stone Tablet */}
            <main className="z-20 w-full max-w-2xl bg-amber-50 border-2 border-[#945e2c] shadow-[12px_12px_0px_0px_rgba(41,37,36,.25)] rounded-3xl p-8 flex flex-col items-center mt-10">
                
                {/* 1. Header: Mission Accomplished */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl  text-[#7c4c1f] uppercase drop-shadow-sm">
                        session Complete
                    </h1>
                    <div className=" mt-3"> You found Agate! </div>
                </div>

                {/* 2. The Big Reward (Hero Visual) */}
                <div className="relative mb-8 group">
                    <div className="absolute -inset-4 bg-yellow-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative w-36 h-36  rounded-full  flex items-center justify-center text-6xl ">
                        {/* Change emoji/pixel art based on score */}
                        <Image src="/gems/gem-7.png" fill alt="" className="pixel-art p-3"></Image>
                    </div>
                </div>

                {/* 3. The Stats Grid: "Loot Collected" */}
                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                    <div className="bg-white/50 border-2 border-dashed border-stone-800/40 p-4 rounded-xl flex flex-col items-center">
                        <span className="text-xs font-black text-stone-400 uppercase">Time Dug</span>
                        <span className="text-2xl font-black text-blue-600">67m</span>
                    </div>
                    <div className="bg-white/50 border-2 border-dashed border-stone-800/40 p-4 rounded-xl flex flex-col items-center">
                        <span className="text-xs font-black text-stone-400 uppercase">Knowledge Ore</span>
                        <span className="text-2xl font-black text-green-600">78%</span>
                    </div>
                </div>

                {/* 4. Detailed Logs (The Scroll) */}
                <div className="w-full bg-stone-100/50 border-2 border-dashed border-stone-400 p-6 rounded-xl mb-8">
                    <h3 className="text-sm font-black text-stone-500 uppercase mb-4">Mission Logs</h3>
                    <ul className="space-y-3 text-sm  text-stone-700">
                        <li className="flex justify-between border-b border-stone-200 pb-2">
                            <span className="text-blue-950">Date</span>
                            <span>{new Date().toLocaleDateString()}</span>
                        </li>
                        <li className="flex justify-between border-b border-stone-200 pb-2">
                            <span className="text-blue-950">Quizzes Points</span>
                            <span className="truncate max-w-[150px]">FileName</span>
                        </li>
                        <li className="flex justify-between">
                            <span className="text-blue-950">Messages sent</span>
                            <span>67 Messages</span>
                        </li>
                    </ul>
                </div>

                {/* 5. Navigation Buttons */}
                <div className="flex gap-4 w-full justify-center items-center">
                    {/* <button 
                    className="flex-1 h-14 bg-blue-600 text-white font-black pixel-art hover:translate-y-1 hover:shadow-none transition-all shadow-[4px_4px_0px_0px_rgba(29,78,216,1)] border-2 border-stone-800">
                        new Session
                    </button> */}
                   
                        <div className="flex gap-40 justify-center items-center w-full">
                            <YellowButton  text={"new Session"} func={null} />
                  
                        <BlueButton text={"return home"} func={null} />
                    

                        </div>
                        
                </div>
            </main>
        </div>















        // <div className="flex flex-col items-center justify-center min-h-screen p-6">
        //     <div className="bg-white p-10 rounded-3xl  text-center max-w-md">
        //         <span className="text-6xl">ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧</span>
        //         <h1 className="text-3xl font-bold text-gray-800 mt-4">
        //             Great job Abeer!
        //         </h1>
        //         <p className="text-gray-500 mt-2">
        //             You have successfully finished the session:
        //         </p>
        //         <div className="mt-4 p-3 bg-blue-50 text-blue-700 font-mono rounded-lg">
        //             {room?.name || "Study Session"}
        //         </div>

        //         <hr className="my-8 border-gray-100" />

        //         <p className="text-sm text-gray-400 italic">
        //             you earned {totalPoints}XP in this room great job!
        //         </p>
        //         <p> points from room = { pointsFromRoom}</p>
        //         <h1>points form quiz = {quizPoints}</h1>

        //     </div>
        // </div>
    );
}

//   <div className="min-h-screen bg-sky-900 flex flex-col items-center p-8 font-mono relative overflow-hidden">
//             {/* Background Decor - Floating pixel stars or lanterns */}
//             <div className="absolute top-10 left-10 text-4xl animate-pulse">🏮</div>
//             <div className="absolute bottom-10 right-10 text-4xl animate-bounce">💎</div>

//             {/* MAIN CONTAINER: The Stone Tablet */}
//             <main className="w-full max-w-2xl bg-amber-50 border-8 border-stone-800 shadow-[12px_12px_0px_0px_rgba(41,37,36,1)] rounded-3xl p-8 flex flex-col items-center mt-10">
                
//                 {/* 1. Header: Mission Accomplished */}
//                 <div className="text-center mb-8">
//                     <h1 className="text-4xl font-black text-stone-800 uppercase tracking-tighter drop-shadow-sm">
//                         Expedition Complete
//                     </h1>
//                     <div className="h-1 w-full bg-stone-800 mt-2"></div>
//                 </div>

//                 {/* 2. The Big Reward (Hero Visual) */}
//                 <div className="relative mb-8 group">
//                     <div className="absolute -inset-4 bg-yellow-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
//                     <div className="relative w-32 h-32 bg-sky-100 rounded-full border-4 border-stone-800 flex items-center justify-center text-6xl shadow-inner">
//                         {/* Change emoji/pixel art based on score */}
//                         💎
//                     </div>
//                 </div>

//                 {/* 3. The Stats Grid: "Loot Collected" */}
//                 <div className="grid grid-cols-2 gap-4 w-full mb-8">
//                     <div className="bg-white/50 border-4 border-stone-800 p-4 rounded-xl flex flex-col items-center">
//                         <span className="text-xs font-black text-stone-400 uppercase">Time Dug</span>
//                         <span className="text-2xl font-black text-blue-600">67m</span>
//                     </div>
//                     <div className="bg-white/50 border-4 border-stone-800 p-4 rounded-xl flex flex-col items-center">
//                         <span className="text-xs font-black text-stone-400 uppercase">Knowledge Ore</span>
//                         <span className="text-2xl font-black text-green-600">78%</span>
//                     </div>
//                 </div>

//                 {/* 4. Detailed Logs (The Scroll) */}
//                 <div className="w-full bg-stone-100/50 border-2 border-dashed border-stone-400 p-6 rounded-xl mb-8">
//                     <h3 className="text-sm font-black text-stone-500 uppercase mb-4">Expedition Logs</h3>
//                     <ul className="space-y-3 text-sm font-bold text-stone-700">
//                         <li className="flex justify-between border-b border-stone-200 pb-2">
//                             <span>📅 Date</span>
//                             <span>{new Date().toLocaleDateString()}</span>
//                         </li>
//                         <li className="flex justify-between border-b border-stone-200 pb-2">
//                             <span>📂 PDF Analyzed</span>
//                             <span className="truncate max-w-[150px]">FileName</span>
//                         </li>
//                         <li className="flex justify-between">
//                             <span>💬 Logs Written</span>
//                             <span>67 Messages</span>
//                         </li>
//                     </ul>
//                 </div>

//                 {/* 5. Navigation Buttons */}
//                 <div className="flex gap-4 w-full">
//                     <button className="flex-1 h-14 bg-blue-600 text-white font-black pixel-art hover:translate-y-1 hover:shadow-none transition-all shadow-[4px_4px_0px_0px_rgba(29,78,216,1)] border-2 border-stone-800">
//                         SHARE REPORT
//                     </button>
//                     <button className="flex-1 h-14 bg-stone-800 text-white font-black pixel-art hover:translate-y-1 transition-all border-2 border-stone-800">
//                         RETURN HOME
//                     </button>
//                 </div>
//             </main>
//         </div>