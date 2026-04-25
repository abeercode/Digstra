import { auth } from "@/auth";
import { createClient } from "@/lib/supabase/server";

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
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="bg-white p-10 rounded-3xl  text-center max-w-md">
                <span className="text-6xl">ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧</span>
                <h1 className="text-3xl font-bold text-gray-800 mt-4">
                    Great job Abeer!
                </h1>
                <p className="text-gray-500 mt-2">
                    You have successfully finished the session:
                </p>
                <div className="mt-4 p-3 bg-blue-50 text-blue-700 font-mono rounded-lg">
                    {room?.name || "Study Session"}
                </div>

                <hr className="my-8 border-gray-100" />

                <p className="text-sm text-gray-400 italic">
                    you earned {totalPoints}XP in this room great job!
                </p>
                <p> points from room = { pointsFromRoom}</p>
                <h1>points form quiz = {quizPoints}</h1>

            </div>
        </div>
    );
}