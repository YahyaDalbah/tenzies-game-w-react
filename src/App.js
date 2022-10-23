import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    const [numofrolls, setnumofrolls] = React.useState(0)
    const [timer, settimer] = React.useState(0)
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    
    React.useEffect(()=>{
        localStorage.setItem("besttime",localStorage.besttime)
    },[])

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            if(timer < localStorage.besttime || localStorage.besttime == 0){
                localStorage.setItem("besttime",timer)
            }
            if(isNaN(localStorage.besttime)){
                localStorage.setItem("besttime",timer)
            }
        }
    }, [dice])
    
    
    React.useEffect(()=>{
        const interval = setInterval(()=>{
            settimer(prev => prev+1)
        },1000)
        if(tenzies){
            clearInterval(interval)
        }
          
        return ()=>{clearInterval(interval)}
        
    },[timer])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setnumofrolls(prev => prev+1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setnumofrolls(0)
            setTenzies(false)
            setDice(allNewDice())
            settimer(0)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
            
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <p>{`num of rolls = ${numofrolls}`}</p>
            <p>{`time = ${timer}`}</p>
            {!isNaN(localStorage.besttime) && <p>{`ur best time is: ${localStorage.besttime}`}</p>}
        </main>
    )
}
