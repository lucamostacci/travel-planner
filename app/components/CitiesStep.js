import { useState, useEffect } from "react";
import styles from './CitiesStep.module.css'

export default function CitiesStep({ cities, setCities, onNext, onBack }) {
  const [cityInput, setCityInput] = useState("")
  const [suggestion, setSuggestion] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const selectCity = (city) => {
    if (cities.includes(city.name)) {
    setErrorMessage(`${city.name} è già nella lista!`)
    setTimeout(() => setErrorMessage(""), 3000)
    setSuggestion([])
    setCityInput("")
    return;
  }
    setCities([...cities, city.name]);
    setSuggestion([]);
    setCityInput("");
  };

  const removeCity = (city) => {
    setCities(cities.filter((c) => c !== city));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const search = async () => {
        if (cityInput === "") { setSuggestion([]); return; }
        setLoading(true);
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=10`);
        const data = await response.json();
        setLoading(false);
        const sorted = (data.results || []).sort((a, b) => (b.population || 0) - (a.population || 0)).slice(0, 5);
        setSuggestion(sorted);
      };
      search();
    }, 400)
    return () => clearTimeout(timer)
  }, [cityInput])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dove vuoi andare? ✈️</h1>
      <p className={styles.subtitle}>Aggiungi una o più città che vuoi visitare.</p>

      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          type="text"
          value={cityInput}
          placeholder="Es. Roma, Parigi, Tokyo..."
          onChange={(e) => setCityInput(e.target.value)}
        />
        {errorMessage && (
          <p style={{
          color: '#e53e3e',
          fontSize: '0.85rem',
          padding: '0.5rem 1rem',
          background: '#fff5f5',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid #fed7d7',
          maxWidth: '480px'
          }}>
        ⚠️ {errorMessage}
          </p>
        )}
        {loading && <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0.5rem 0'}}>Sto cercando...</p>}
        {suggestion.length > 0 && (
          <div className={styles.dropdown}>
            {suggestion.map((s) => (
              <div key={s.id} className={styles.dropdownItem} onClick={() => selectCity(s)}>
                {s.name}, {s.admin1}, {s.country}
              </div>
            ))}
          </div>
        )}
      </div>

      {cities.length > 0 && (
        <div className={styles.chips}>
          {cities.map((city) => (
            <span key={city} className={styles.chip}>
              {city}
              <span className={styles.chipRemove} onClick={() => removeCity(city)}>×</span>
            </span>
          ))}
        </div>
      )}

      <div className={styles.navButtons}>
        <button className={styles.buttonSecondary} onClick={onBack}>← Indietro</button>
        <button className={styles.button} disabled={cities.length === 0} onClick={onNext}>Avanti →</button>
      </div>
    </div>
  );
}