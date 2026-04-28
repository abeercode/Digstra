import { useEffect, useState } from "react";
import { saveUserScore } from "@/app/lib/actions";

export default function QuizCard({ quiz, onClose, RoomId, quizId, user, tookQuiz, prevScore, onComplete }) {
    const [isChecked, setIsChecked] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAns, setSelectedAns] = useState(null);
    const [score, setScore] = useState(tookQuiz ? prevScore : 0);
    const [showResult, setShowResult] = useState(tookQuiz)
    const [isSaving, setIsSaving] = useState(false);

    const [hover, setHover] = useState(false);

    const handleNextBtn = () => {
        setCurrentIndex(currentIndex + 1);
        setIsChecked(false)
        setSelectedAns(null)
    }
    const handleFinishBtn = async () => {

        setIsSaving(true)
        const result = await saveUserScore(RoomId, quizId, score, quiz.length, user.name, user.id);

        if (result) {
            setShowResult(true)

            if (onComplete) {
                onComplete(score)   //call the function in parent "Quiz.js" to update the score 
            }

        } else {
            console.error("Failed to save score");
        }
        setIsSaving(false)

    }
    if (showResult) {
        return (
            <div className="text-center p-6 animate-in zoom-in duration-300">
                <h2 className="text-3xl font-bold text-[#eaae09]">Quiz Complete!</h2>
                <div className="my-8">
                    <span className="text-6xl font-extrabold">{score}</span>
                    <span className="text-2xl text-gray-500"> / {quiz.length}</span>
                </div>
                <p className="text-gray-500 text-[17px] mb-8 ">Your score is saved  {" (ദ്ദി ๑>؂•̀๑)"}</p>
                <button
                    onClick={onClose}
                       onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                            className="w-40 h-20 text-[20px] text-white font-bold bg-contain pixel-art hover:translate-x-1 hover:translate-y-1" style={{
                                backgroundImage: `url(${hover ? "/blueBtnHover.png" : "/blueBtn.png"})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                >
                    Return to session
                </button>
            </div>
        )
    }
    const currentQ = quiz[currentIndex]
    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="mb-4">
                    <span className="text-sm uppercase font-bold text-[#906539]">Question {currentIndex + 1} </span>
                    <h1 className="text-xl font-semibold text-[#111d48] mt-1 pt-1">{currentQ.question}</h1>

                </div>

                <div className="flex flex-col gap-3">

                    {currentQ.options.map((option, index) => {
                        let colorClass = " bg-[#f2fffe] border-gray-300 hover:border-blue-300 border-dashed";
                        if (isChecked) {

                            // correct answer green
                            if (index === currentQ.correctIndex) {
                                colorClass = "bg-[#e8fac8] border-[#628f1b] border-dashed text-[#628f1b]";
                            }
                            // wrong answer red
                            else if (selectedAns === index) {
                                colorClass = "bg-[#ffe6e6] border-[#B82222] border-dashed text-[#B82222]";
                            }
                        }
                        else if (selectedAns === index) {
                            colorClass = "bg-[#c1f7f5] border-dashed border-[#256d94] text-[#256d94]";
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
                    <div className="mt-4 p-4 bg-[#fdf3c6] rounded-lg border-l-4 border-[#fad937] animate-in slide-in-from-top-2">
                        <p className="text-sm text-[#162456]">
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
                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                            className="w-24 h-12 text-white font-bold bg-contain text-[16px] pixel-art hover:translate-x-1 hover:translate-y-1" style={{
                                backgroundImage: `url(${hover ? "/blueBtnHover.png" : "/blueBtn.png"})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                        >
                            Check
                        </button>
                    ) : (
                        <button

                            onMouseEnter={() => setHover(true)}
                            onMouseLeave={() => setHover(false)}
                            className="w-24 h-12 text-white font-bold bg-contain text-[16px] pixel-art hover:translate-x-1 hover:translate-y-1" style={{
                                backgroundImage: `url(${hover ? "/blueBtnHover.png" : "/blueBtn.png"})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}
                            onClick={currentIndex < quiz.length - 1 ? handleNextBtn : handleFinishBtn}

                        >
                            {currentIndex < quiz.length - 1 ? "Next" : "Finish"}
                        </button>
                    )}
                </div>
            </div>
        </>
    )
}