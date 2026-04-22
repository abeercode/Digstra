import { useEffect, useState } from "react";

export default function QuizCard({ quiz }) {
    const [isUploaded, setIsUploaded] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    // const [explanation, setExplanation] = useState("")
    const [selectedAns, setSelectedAns] = useState(null);
    const [allAns, setAllAns] = useState({})
    const [score, setScore] = useState(0);

    // const[isClicked , setIsClicked] = useState(false); not needed

    const handleCheck = () => {

    }

    return (
        <>

            <h1> {quiz[currentIndex].question}</h1>

            {quiz[currentIndex].options.map((option, index) => {
                let colorClass = "bg-white border-gray-300";
                if (selectedAns === index) {
                    colorClass = "bg-blue-100 border-blue-500";
                }
                return (<button key={index}
                    type="button"
                    onClick={() => setSelectedAns(index)} // This saves the choice
                    disabled={isChecked}
                    className={`p-3 border rounded mb-2 transition-all ${colorClass}`}> {option} </button>)
            })}


            {/* check answer */}
            <button
                disabled={selectedAns === null || isChecked} // Disable if nothing picked OR already checked
                onClick={() => {
                    setIsChecked(true)

                    if (selectedAns === quiz[currentIndex].correctIndex) {
                        setScore(prev => prev + 1)

                    }
                    // setAllAns(...[currentIndex:quiz[currentIndex].options.indexOf(selectedAns)])
                    setAllAns(prev => ({
                        ...prev, [currentIndex]: selectedAns
                    }))
                }}           // Reveal the answer!
            >
                Check Answer
            </button>
            {/* next question */}
            {isChecked && (<button onClick={() => {
                setCurrentIndex(currentIndex + 1);
                setIsChecked(false)
                setSelectedAns(null)
            }}  > next</button>)}

            {/* <button name="1"> {quiz[currentIndex].options[0]}</button>
         <br></br>
             <button name="2">{quiz[currentIndex].options[1]}</button>
             <br></br>
              <button name="3">{quiz[currentIndex].options[2]}</button>
             <br></br>
             <button name="4">{quiz[currentIndex].options[3]}</button>
           <br></br>
           <br></br>
            <br></br> 
             <button disabled={selectedAns == null} 
            onClick={() => { setIsClicked(true) }} 
             name="checked"> check your answer</button> */}
             
        </>
    )
}