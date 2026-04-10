import { useState } from 'react'
import styles from './LandingPage.module.css'

const DESTINATIONS = [
  { name: "Roma", img: "/destinations/roma.jpg" },
  { name: "Milano", img: "/destinations/milano.jpg" },
  { name: "Napoli", img: "/destinations/napoli.jpg" },
  { name: "Pisa", img: "/destinations/pisa.jpg" },
  { name: "Torino", img: "/destinations/torino.jpg" },
]

export default function LandingPage({ onStart }) {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c === 0 ? DESTINATIONS.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === DESTINATIONS.length - 1 ? 0 : c + 1))

  return (
    <div className={styles.container}>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            Pianifica il viaggio<br />
            <span className={styles.heroAccent}>perfetto</span>
          </h1>
          <p className={styles.heroSub}>
            Inserisci da dove parti, scegli le città e i tuoi interessi — 
            l'AI genera un itinerario personalizzato con il percorso ottimizzato su Google Maps.
          </p>
          <button className={styles.ctaButton} onClick={onStart}>
            Inizia a pianificare →
          </button>
        </div>
        <div className={styles.heroImage}>
          <img src="/hero.jpg" alt="Travel" />
        </div>
      </div>

      {/* Come funziona */}
      <div className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>Come funziona</h2>
        <div className={styles.steps}>
          <div className={styles.stepCard}>
            <div className={styles.stepIcon}>📍</div>
            <h3>1. Dove sei</h3>
            <p>Inserisci il tuo indirizzo di partenza — anche solo il nome dell'hotel.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepIcon}>🏙️</div>
            <h3>2. Dove vuoi andare</h3>
            <p>Aggiungi le città che vuoi visitare e scegli i tuoi interessi.</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepIcon}>🗺️</div>
            <h3>3. Il tuo itinerario</h3>
            <p>L'AI genera 8 attrazioni ordinate per distanza, apribile su Google Maps.</p>
          </div>
        </div>
      </div>

      {/* Destinazioni popolari */}
      <div className={styles.destinations}>
        <h2 className={styles.sectionTitle}>Destinazioni popolari</h2>
        <div className={styles.carousel}>
          <button className={styles.carouselBtn} onClick={prev}>‹</button>
          <div className={styles.carouselTrack}>
            {DESTINATIONS.map((d, i) => {
              const total = DESTINATIONS.length
              let offset = (i - current + total) % total
              if (offset > 2) offset -= total
              const visible = offset >= 0 && offset <= 2
              return (
                <div
                  key={d.name}
                  className={styles.destCard}
                  onClick={onStart}
                  style={{
                    transform: `translateX(${offset * 105}%)`,
                    opacity: visible ? 1 : 0,
                    pointerEvents: visible ? 'auto' : 'none'
                  }}
                >
                  <img src={d.img} alt={d.name} />
                  <span style={{textShadow: '0 2px 8px rgba(0,0,0,0.8)'}}>
                    {d.name}
                  </span>
                </div>
              )
            })}
          </div>
          <button className={styles.carouselBtn} onClick={next}>›</button>
        </div>
        <div className={styles.dots}>
          {DESTINATIONS.map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>

      {/* CTA finale */}
      <div className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Pronto a partire?</h2>
        <button className={styles.ctaButton} onClick={onStart}>
          Crea il tuo itinerario →
        </button>
      </div>

    </div>
  )
}