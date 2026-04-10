'use client'

import { useState } from 'react'
import styles from './page.module.css'
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
  const [radius, setRadius] = useState(5)

  return (
    <div className={styles.wrapper}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <span className={styles.logo}>Travel Planner</span>
        <div className={styles.navLinks}>
          <a className={styles.navLink} href="#">Come funziona</a>
          <a className={styles.navLink} href="#">Accedi</a>
        </div>
      </nav>

      {/* Contenuto */}
      <div className={styles.content}>
        {/* Step indicator */}
        <div className={styles.stepIndicator}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`${styles.stepDot} ${s === step ? styles.stepDotActive : ''} ${s < step ? styles.stepDotDone : ''}`} />
          ))}
        </div>

        {step === 1 && <StartingStep startingPoint={startingPoint} setStartingPoint={setStartingPoint} startCoords={startCoords} setStartCoords={setStartCoords} radius={radius} setRadius={setRadius} onNext={() => setStep(2)} />}
        {step === 2 && <CitiesStep cities={cities} setCities={setCities} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <InterestStep interests={interests} setInterests={setInterests} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {step === 4 && <ResultsStep startingPoint={startingPoint} startCoords={startCoords} cities={cities} interests={interests} radius={radius} onBack={() => setStep(3)} />}
      </div>
    </div>
  )
}