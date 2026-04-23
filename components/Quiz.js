"use client"
import { extractPdfText } from "@/app/lib/actions"
import { useState, useEffect } from "react"
import QuizCard from "./QuizCard";

export default function Quiz({ RoomId }) {

    const [status, setStatus] = useState("");         // To show "AI is thinking..."
    const [quiz, setQuiz] = useState([]);             // To store the array of 5 questions
    const [isLoading, setIsLoading] = useState(false);

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
                setStatus("");
                setIsChecked(true);
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

    return (
        <>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <form onSubmit={handleSubmit} className="flex items-center gap-4" >
                    <input type="file" id="inputFile" name="inputFile" accept=".pdf" required
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    <button type="submit" id="btnFile" className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"  >{isLoading ? "Generating..." : "Generate Quiz"} </button>

                    {/* <textarea className="w-full h-96 font-mono text-sm border p-4 mt-4" id="outputTest" value={textTest} readOnly></textarea> */}
                </form >
                {status && <p className="mt-2 text-sm text-blue-600 font-medium">{status}</p>}

                {quiz.length > 0 && isChecked && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
                            {/* Close Button */}
                            <button onClick={() => setQuiz([])} className="absolute top-4 right-4 text-gray-500">✕</button>

                            <QuizCard quiz={quiz} onClose={() => setQuiz([])} />
                        </div>
                    </div>

                )}
            </div>

        </>
    )
}
