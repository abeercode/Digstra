"use client"
import { extractPdfText } from "@/app/lib/actions"
import { useState, useEffect, useMemo } from "react"

export default function Quiz() {
   const [textTest, setTextTest] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setTextTest("texts is extracting please wait");
        const formdata = new FormData(e.currentTarget)

        const returnedText = await extractPdfText(formdata);
        setTextTest(returnedText)
        setIsLoading(false)
    }
    return (

        <>
            <br />
            <form onSubmit={handleSubmit}>
                <input type="file" id="inputFile" name="inputFile" accept=".pdf" required/>
                <button type="submit" id="btnFile" name="btnFile" >upload  </button>
                <textarea id="outputTest" value={textTest} readOnly></textarea>

            </form >
        </>
    )
}