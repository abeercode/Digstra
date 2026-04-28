"use client"
import { extractPdfText } from "@/app/lib/actions"
import { useState, useEffect } from "react"
import QuizCard from "./QuizCard";
import { client } from "@/lib/supabase/client";

export default function Quiz({ RoomId, user }) {
    const [status, setStatus] = useState("");         // to show "AI is thinking..."
    const [quiz, setQuiz] = useState([]);             // To store the array of 5 questions
    const [isLoading, setIsLoading] = useState(false);
    //for saving to the database and real-time feature
    const [quizId, setQuizId] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [tookQuiz, setTookQuiz] = useState(false);
    const [prevScore, setPrevScore] = useState(0)

    const [hover, setHover] = useState(false);

    const[hoverJoinResult , setHoverJoinResult] = useState(false)

    //not needed ig (?)
    const [isChecked, setIsChecked] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus("AI is extracting and generating questions... please wait.");
        try {
            const formdata = new FormData(e.currentTarget);
            const result = await extractPdfText(formdata, RoomId);

            if (result && result.success) {
                setQuiz(result.quiz)
                setQuizId(result.quizId)
                setStatus("");
                setIsChecked(true);
                setIsModalOpen(true)
            } else {
                setStatus("Error: " + (result?.message || "Unknown error"));
            }
        } catch (error) {
            // This catches network errors or crashes during the request
            console.error("Frontend Error:", error);
            setStatus("Connection failed.");
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        const supabase = client();
        async function loadExistingQuiz() {

            const { data: quizData } = await supabase
                .from('quizzes')
                .select('*') // Get everything, including the ID
                .filter('room_id', 'eq', RoomId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (quizData) {
                setQuiz(quizData.content);
                setQuizId(quizData.id);
                setIsChecked(true);

                const { data: scoreData } = await supabase       //--> to check if the user has already took the quiz
                    .from("quiz_scores")
                    .select("score")
                    .eq("quiz_id", quizData.id)
                    .eq("user_id", user.id)
                    .maybeSingle();

                if (scoreData) { setTookQuiz(true); setPrevScore(scoreData.score) }
            }
        }
        loadExistingQuiz();
        const channel = supabase
            .channel(`room-${RoomId}`)
            .on("postgres_changes", {

                event: "INSERT",
                schema: "public",
                table: "quizzes",
                filter: `room_id=eq.${RoomId}`
            }, (payload) => {
                console.log("new quiz")
                setQuiz(payload.new.content);
                setQuizId(payload.new.id);
                setIsChecked(true);
                setTookQuiz(false);
                setPrevScore(0)
            })
            .subscribe();

        return () => {

            supabase.removeChannel(channel)
        }
    }, [RoomId, user.id]);

    const handleQuizComplete = (finalScore) => { // the child component get to call this function and update score immediatly 
        setTookQuiz(true)
        setPrevScore(finalScore)
    }
    return (
        <>
            <div className="p-2 pt-4 pb-4 bg-gray-50 rounded-xl border border-gray-200">
                <form onSubmit={handleSubmit} className="flex items-center gap-0.5" >
                    <input type="file" id="inputFile" name="inputFile" accept=".pdf" required
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#c7915b] hover:file:bg-blue-100 " />

                    <button type="submit" id="btnFile"
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        className="w-32 h-16 text-blue-900 font-bold bg-contain text-[15px] pixel-art hover:translate-x-1 hover:translate-y-1" style={{
                            backgroundImage: `url(${hover ? "/yellewBtnBigHover.png" : "/yellewBtnBig.png"})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }} >{isLoading ? "Generating" : "Generate"} </button>

                    {/* <textarea className="w-full h-96 font-mono text-sm border p-4 mt-4" id="outputTest" value={textTest} readOnly></textarea> */}
                </form >
                {status && <p className="mt-2 text-sm text-[#307894] font-medium">{status}</p>}



{/* quiz section */}
                {quiz.length > 0 && !isModalOpen && (
                    <div className="mt-8 p-4 bg-[#d4faf9] border border-[#256d94] rounded-lg flex justify-between items-center">
                        <p className="font-bold text-[#256d94]">{!tookQuiz ? "An active quiz is available!" : "you've already took the quiz"} </p>
                       
                       {tookQuiz ?(
                        <button
                            onClick={() => setIsModalOpen(true)}
                            onMouseEnter={() => setHoverJoinResult(true)}
                            onMouseLeave={() => setHoverJoinResult(false)}
                            className="w-32 h-16 text-white font-bold bg-contain text-[16px] pixel-art hover:translate-x-1 hover:translate-y-1" style={{
                                backgroundImage: `url(${hoverJoinResult ? "/grayBtnHover.png" : "/grayBtn.png"})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                       >
                            View Score
                        </button>
                       ):(

                        <button
                            onClick={() => setIsModalOpen(true)}
                            onMouseEnter={() => setHoverJoinResult(true)}
                            onMouseLeave={() => setHoverJoinResult(false)}
                            className="w-32 h-16 text-white font-bold bg-contain text-[16px] pixel-art hover:translate-x-1 hover:translate-y-1" style={{
                                backgroundImage: `url(${hoverJoinResult ? "/blueBtnHover.png" : "/blueBtn.png"})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                       
                       
                       >
                           Join
                        </button>
                       )}
                       
                       
                        {/* <button
                            onClick={() => setIsModalOpen(true)}
                            className={`${tookQuiz ? 'bg-gray-800' : 'bg-blue-600'}`}
                       
                       
                       >
                            {tookQuiz ? "View Your Score" : "Join Quiz"}
                        </button> */}
                    </div>
                )}
                {isModalOpen && quiz.length > 0 && isChecked && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                        <div className="bg-amber-50 rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
                            {/* Close Button */}
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500">𝐗</button>

                            <QuizCard
                                quiz={quiz}
                                quizId={quizId}
                                RoomId={RoomId}
                                user={user}
                                onClose={() => setIsModalOpen(false)}
                                tookQuiz={tookQuiz}
                                prevScore={prevScore}
                                onComplete={handleQuizComplete} //this concept called "lifting state up"

                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
