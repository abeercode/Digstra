"use client"
import { extractPdfText } from "@/app/lib/actions"
import { useState, useEffect, useMemo, use } from "react"
import QuizCard from "./QuizCard";

export default function Quiz({ RoomId }) {
    const [textTest, setTextTest] = useState("");

    // Replace your existing state lines with these:
    const [status, setStatus] = useState("");         // To show "AI is thinking..."
    const [quiz, setQuiz] = useState([]);             // To store the array of 5 questions
    const [selectedAns, setSelectedAns] = useState({}); // To store { questionIndex: answerIndex }
    const [isLoading, setIsLoading] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isChecked, setIsChecked] = useState(false);
    const [score, setScore] = useState(0);


    const handleSelect = (qIndex, ansIndex) => {
        setSelectedAns(prev => ({
            ...prev,
            [qIndex]: ansIndex // Standard "Power Move" we discussed
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus("AI is extracting and generating questions... please wait.");
        try {
            const formdata = new FormData(e.currentTarget);
            const result = await extractPdfText(formdata, RoomId);

            if (result && result.success) {
                setQuiz(result.quiz)
                setStatus("Quiz Generated!");
                setIsChecked(true);

                // setTextTest(prettyJson);
            } else {
                //  setTextTest("Server Error: " + (result?.message || "Unknown error occurred"));
                setStatus("Error: " + (result?.message || "Unknown error"));
            }
        } catch (error) {
            // This catches network errors or crashes during the request
            console.error("Frontend Error:", error);
            setTextTest("Failed to connect to the server.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <br />

            <form onSubmit={handleSubmit}>
                <input type="file" id="inputFile" name="inputFile" accept=".pdf" required />
                <button type="submit" id="btnFile" name="btnFile"  >upload  </button>

                {/* <textarea className="w-full h-96 font-mono text-sm border p-4 mt-4" id="outputTest" value={textTest} readOnly></textarea> */}

            </form >



            {quiz.length > 0 && isChecked && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-red bg-opacity-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
                        {/* Close Button */}
                        <button onClick={() => setQuiz([])} className="absolute top-4 right-4 text-gray-500">✕</button>

                        <QuizCard quiz={quiz} />
                    </div>
                </div>
            )}
        </>
    )
}
