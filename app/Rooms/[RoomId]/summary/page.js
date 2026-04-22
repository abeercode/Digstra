
//this whole code is copy paste , so abeer edit it later don't forget !!!!!!!


import { createClient } from "@/lib/supabase/server";

export default async function SummaryPage({ params }) {
    // 1. Wait for the params
    const { RoomId } = await params;
    
    // 2. Fetch the room details to show them a nice summary
    const supabase = await createClient();
    const { data: room } = await supabase
        .from('rooms')
        .select('name')
        .eq('id', RoomId)
        .single();

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
                
                {/* <p className="text-sm text-gray-400 italic">
                    Summary stats and AI quizzes will be loaded here soon.
                </p>
                 */}
            </div>
        </div>
    );
}