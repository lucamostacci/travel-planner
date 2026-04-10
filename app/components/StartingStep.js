import { useState, useEffect } from "react";
import styles from './StartingStep.module.css'

export default function StartingStep({ startCoords, setStartCoords, startingPoint, setStartingPoint, radius, setRadius, onNext }) {
  const [suggestion, setSuggestion] = useState([])
  const [selected, setSelected] = useState(false)
  const [loading, setLoading] = useState(false)

  const selectSuggestion = (place) => {
    setStartingPoint(place.display_name)
    setStartCoords({ lat: place.lat, lon: place.lon })
    setSuggestion([])
    setSelected(true)
  }

  useEffect(() => {
    if (selected) { setSelected(false); return; }
    const timer = setTimeout(() => {
      const search = async () => {
        if (startingPoint === "") { setSuggestion([]); return; }
        setLoading(true);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${startingPoint}&format=json&limit=5`);
        const data = await response.json();
        setLoading(false);
        setSuggestion(data.slice(0, 5))
      }
      search();
    }, 400)
    return () => clearTimeout(timer)
  }, [startingPoint])

  const checkStartingPoint = () => {
    if (startingPoint === "") return
    onNext()
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Da dove parti? 🗺️</h1>
      <p className={styles.subtitle}>
        Inserisci il tuo indirizzo di partenza — anche solo il nome dell'hotel o della piazza.
      </p>

      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          type="text"
          id="startingPoint"
          placeholder="Es. Via Roma 10, Milano · Hotel Borghese, Roma..."
          value={startingPoint}
          onChange={(e) => setStartingPoint(e.target.value)}
        />
        {loading && <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0.5rem 0'}}>Sto cercando...</p>}
        {suggestion.length > 0 && (
          <div className={styles.dropdown}>
            {suggestion.map((s) => (
              <div key={s.place_id} className={styles.dropdownItem} onClick={() => selectSuggestion(s)}>
                {s.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.sliderContainer}>
        <div className={styles.sliderHeader}>
          <label className={styles.sliderLabel}>Raggio massimo</label>
          <span className={styles.sliderValue}>{radius} km</span>
        </div>
        <input
          className={styles.slider}
          type="range"
          min="1"
          max="20"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        />
        <div className={styles.sliderTicks}>
          <span>1 km</span>
          <span>10 km</span>
          <span>20 km</span>
        </div>
      </div>

      <button className={styles.button} onClick={checkStartingPoint} disabled={!startingPoint}>
        Avanti →
      </button>
    </div>
  )
}