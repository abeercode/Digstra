import { auth } from "@/auth";
import { client } from "@/lib/supabase/client";
import { redirect } from "next/dist/server/api-utils";
import Image from "next/image";
import Link from "next/link";

export default async function Dashboard() {

    const session = await auth();
    if (!session) {
        redirect("/")
        return <p>Redirecting...</p>;
    }// redirecting to home page

    const userId = session?.user?.id
    const supabase = await client();

    // to fetch user data from profiles table
    const { data: userData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    //to fetch quiz score 
    const { data: quizData } = await supabase
        .from("quiz_scores")
        .select("score")
        .eq("user_id", userId);

    let totalScores = 0;
    if (quizData) {
        for (let i = 0; i < quizData.length; i++) {
            totalScores += parseInt(quizData[i]["score"])
        }
    }
    let aveQuiz = (((totalScores / quizData.length) / 5) * 100).toFixed(2)

    // to fetch  finished rooms data
    const { data: FRoom } = await supabase
        .from("rooms")
        .select("id")
        .eq("host_id", userId)
        .eq("is_finished", true);

    let completedSessions = FRoom?.length

    const extractRoomsData = async () => {

        const { data: roomData } = await supabase
            .from("rooms")
            .select("id, name, duration_minutes")
            .eq("host_id", userId)
            .eq("is_finished", true)

        const { data: quizzes } = await supabase
            .from("quiz_scores")
            .select("room_id, score")
            .eq("user_id", userId);

        const scoreMap = {};
        quizzes?.forEach(q => {
            scoreMap[q.room_id] = q.score;
        });
        const mergedData = roomData?.map(room => {
            return {
                id: room.id,
                name: room.name,
                duration: room.duration_minutes,
                score: scoreMap[room.id] ?? 0
            };
        });
        return mergedData
    }
    const pastSessions = await extractRoomsData()
    console.log(pastSessions)

    // console.log("here is your data", roomData)
    return (<>
        <div id="MotherContainer" className="bg-[#dcfdff]">
            <div className="p-8 max-w-4xl mx-auto pt-20 ">

                {/* the name and avatar section */}
               
                <main >
                    {/* the name and avatar section */}
                    <header className=" mb-10 flex items-center gap-4">
                        <div className="relative w-30 h-30 border border-gray-300 rounded-full overflow-hidden bg-stone-100">
                            <Image
                                // src={userData?.avatar_url}
                                src="/avatarSquare.png"
                                width={0}
                                height={0}
                                alt="profile-pic"
                                className="object-cover pixelated pixel-art w-40 h-auto pt-2"
                            />
                        </div>
                        <h1 className="text-3xl font-bold">Welcome, {userData.full_name}</h1>
                        <p className="text-[#40849f]">You have earned <strong className="text-[#6abe30]"> {userData.points} </strong> points so far ⛁</p>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* a  huge button that direct user to create session page*/}
                        <Link href="/Rooms">
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:border-[#d3f7ad] hover:bg-[#e6fab9] transition-all cursor-pointer">

                                <Image src="/axe.png" width={0} height={0} alt=""
                                    className="w-16 h-auto pixel-art" />
                                {/* <span className="text-4xl mb-2">⛏️</span> */}
                                <h2 className="font-bold">Start New Session</h2>
                                <p className="text-sm text-gray-500">Set a timer and start digging</p>
                            </div>
                        </Link>

                        {/* progress section*/}
                        <div className="bg-[#162456] text-white rounded-xl p-8 ">
                            <h2 className="text-[#fad937] font-bold mb-4">Progress</h2>

                            <div className="space-y-2 flex flex-col gap-3">
                                <div className="flex justify-between text-sm">
                                    <span>Sessions Completed</span>
                                    <span>{completedSessions}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Quiz Average</span>
                                    <span>{aveQuiz}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Recent Activity Table */}
                    <section className="mt-12">
                        <h2 className="font-bold text-xl mb-4">Past completed sessions</h2>
                        <div className="bg-white border- rounded-lg overflow-hidden">
                            {/* Map through Supabase 'rooms' data */}
                            <table className="w-full text-left">
                                <thead className="bg-[#f3cba1] text-xs uppercase">
                                    <tr>
                                        <th className="p-4">Room Name</th>
                                        <th className="p-4">Duration</th>
                                        <th className="p-4">Points</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {/* check if pastSessions exists and has data */}
                                    {pastSessions?.length > 0 ? (
                                        pastSessions.map((session) => (

                                            <tr key={session.id} className="hover:bg-stone-50 transition-colors">


                                                <td className="p-4 font-medium text-stone-700">
                                                    {session.name}
                                                </td>

                                                <td className="p-4 text-gray-500">
                                                    {session.duration}m
                                                </td>

                                                <td className="p-4 text-[#6abe30] font-bold">

                                                    +{Math.floor(session.duration / 5)} XP
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        /* What to show if the user has NO sessions yet */
                                        <tr>
                                            <td colSpan="3" className="p-8 text-center text-gray-400 italic">
                                                No expeditions. Time to start digging!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    </>)
}