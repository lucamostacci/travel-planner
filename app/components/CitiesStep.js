import { useState, useEffect } from "react";
import styles from './CitiesStep.module.css'

export default function CitiesStep({ cities, setCities, onNext , onBack}) {
  const [cityInput, setCityInput] = useState("")
  const [suggestion, setSuggestion] =  useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const addCity = async () => {
    if (cityInput === "") return;
    if (cities.includes(cityInput)) return;
    setLoading(true)
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=10`)
    const data = await response.json()
    setLoading(false)
    const sorted = (data.results || []).sort((a, b) => (b.population || 0) - (a.population || 0)).slice(0, 5);
    setSuggestion(sorted);
  };

  const selectCity = (city) => {
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
      if (cityInput === "") {
        setSuggestion([]);
        return;
      }
      setLoading(true);
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}&count=10&language=it`,
      );
      const data = await response.json();
      setLoading(false);
      const sorted = (data.results || [])
        .sort((a, b) => (b.population || 0) - (a.population || 0))
        .slice(0, 5);
      setSuggestion(sorted);
    };

    search();
   }, 400)

  return () => clearTimeout(timer)
}, [cityInput])

  return (
    <div>
      <p>Scegli la città che visiterai</p>

      <div className={styles.inputContainer}>
        <input
        type="text"
        value={cityInput}
        onChange={(e) => setCityInput(e.target.value)}
      />
      
      {loading && <p>Sto cercando...</p>}
      {suggestion.length > 0 && (
        <div className={styles.dropdown}>
          {suggestion.map((s) => (
            <div key={s.id} className={styles.dropdownItem} onClick={() => selectCity(s)}>
              {s.name}, {s.admin1}, {s.country}
            </div>
          ))}
        </div>
      )} </div>
      {cities.map((city) => (
        <p key={city}>
          {city} <button onClick={() => removeCity(city)}>X</button>
        </p>
      ))}

      <button disabled={cities.length===0} onClick={() => onNext()}>Avanti</button>
      <button onClick={() => onBack()}>Torna indietro</button>
    </div>
  );
}
