import { useEffect, useState } from "react";

export default function QuizCard({ quiz , onClose
 }) {

    const [isChecked, setIsChecked] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAns, setSelectedAns] = useState(null);
    const [allAns, setAllAns] = useState({})
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false)


    const handleNextBtn = () => {
        setCurrentIndex(currentIndex + 1);
        setIsChecked(false)
        setSelectedAns(null)
    }

    const handleFinishBtn = () => {
        setShowResult(true)
    }

    if (showResult) {
        return (
            <>
                <div className="text-center p-6">
                    <h2 className="text-3xl font-bold text-blue-600">Quiz Complete!</h2>
                    <div className="my-8">
                        <span className="text-6xl font-extrabold">{score}</span>
                        <span className="text-2xl text-gray-500"> / {quiz.length}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all font-bold"
                    >
                        Return to Room
                    </button>
                </div>
            </>
        )
    }
    const currentQ = quiz[currentIndex]
    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="mb-4">
                    <span className="text-sm uppercase font-bold text-blue-600 ">Question {currentIndex + 1} </span>
                    <h1 className="text-xl font-semibold text-gray-800 mt-1">{currentQ.question}</h1>

                </div>

                <div className="flex flex-col gap-3">

                    {currentQ.options.map((option, index) => {
                        let colorClass = "bg-white border-gray-300 hover:border-blue-300";
                        if (isChecked) {

                            // Mark the correct answer green
                            if (index === currentQ.correctIndex) {
                                colorClass = "bg-green-100 border-green-500 text-green-700";
                            }
                            // Mark user's wrong answer red
                            else if (selectedAns === index) {
                                colorClass = "bg-red-100 border-red-500 text-red-700";
                            }
                        }
                        else if (selectedAns === index) {
                            colorClass = "bg-blue-100 border-blue-500 text-blue-700";
                        }
                        return (<button key={index}
                            type="button"
                            onClick={() => setSelectedAns(index)} // This saves the choice
                            disabled={isChecked}
                            className={`p-3 border rounded mb-2 transition-all ${colorClass}`}> {option} </button>)
                    })}
                </div>
                {/* explination */}
                {isChecked && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400 animate-in slide-in-from-top-2">
                        <p className="text-sm text-blue-800">
                            <span className="font-bold">Explanation: </span>
                            {currentQ.explanation}
                        </p>
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    {!isChecked ? (
                        <button
                            disabled={selectedAns === null}
                            onClick={() => {
                                setIsChecked(true);
                                if (selectedAns === currentQ.correctIndex) setScore(prev => prev + 1);
                            }}
                            className="bg-black text-white px-6 py-2 rounded-lg disabled:opacity-30 font-bold"
                        >
                            Check Answer
                        </button>
                    ) : (
                        <button
                            onClick={currentIndex < quiz.length - 1 ? handleNextBtn : handleFinishBtn}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
                        >
                            {currentIndex < quiz.length - 1 ? "Next Question" : "Finish Quiz"}
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}