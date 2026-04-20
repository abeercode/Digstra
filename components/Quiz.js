"use client"
import { extractPdfText } from "@/app/lib/actions"
import { useState, useEffect, useMemo } from "react"

export default function Quiz() {
    const [textTest, setTextTest] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTextTest("AI is extracting and generating questions... please wait.");

        try {
            const formdata = new FormData(e.currentTarget);
            const result = await extractPdfText(formdata);

            // CHECK: Did the server actually send back the quiz?
            if (result && result.success) {
                const prettyJson = JSON.stringify(result.quiz, null, 2);
                setTextTest(prettyJson);
            } else {
                // If the server sent back an error object
                setTextTest("Server Error: " + (result?.message || "Unknown error occurred"));
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
                <button type="submit" id="btnFile" name="btnFile" >upload  </button>
                <textarea className="w-full h-96 font-mono text-sm border p-4 mt-4" id="outputTest" value={textTest} readOnly></textarea>

            </form >
        </>
    )
}