  'use client'

  import { useState } from 'react'
  import StartingStep from './components/StartingStep'
  import CitiesStep from './components/CitiesStep'
import InterestStep from './components/InterestStep'
import ResultsStep from './components/ResultStep'

  export default function Home() {
    const [startingPoint, setStartingPoint] = useState("")
    const [interests, setInterests] = useState([])
    const [step, setStep] = useState(1)
    const [cities, setCities] = useState([])
    const [startCoords, setStartCoords] = useState(null)

    return (
      <div>
        <h1>Travel Planner</h1>
        {step === 1 && (
          <StartingStep
            startingPoint={startingPoint}
            setStartingPoint={setStartingPoint}
            startCoords={startCoords}
            setStartCoords={setStartCoords}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <CitiesStep
            cities={cities}
            setCities={setCities}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <InterestStep
            interests={interests}
            setInterests={setInterests}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <ResultsStep
            startingPoint={startingPoint}
            startCoords={startCoords}
            cities={cities}
            interests={interests}
            onBack={()=> setStep(3)}
          />  
        )}
      </div>
    );
  }