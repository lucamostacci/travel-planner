import { useState, useEffect } from "react";
import styles from './StartingStep.module.css'

export default function StartingStep({ startCoords, setStartCoords, startingPoint, setStartingPoint, onNext }) {
  const [suggestion, setSuggestion] =  useState([])
  const [selected, setSelected] = useState(false)
  const [loading, setLoading] = useState(false)

  const selectSuggestion = (place) => {
    setStartingPoint(place.display_name)
    setStartCoords({ lat: place.lat, lon: place.lon })
    setSuggestion([])
    setSelected(true)
  };  

  useEffect(() => {
        if (selected) {
        setSelected(false);
        return;
        }
      const timer = setTimeout(() => {
      const search = async () => {
        if (startingPoint === "") {
          setSuggestion([]);
          return;
        }
        setLoading(true);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${startingPoint}&format=json&limit=5`,
        );
        const data = await response.json();
        setLoading(false);
        setSuggestion(data.slice(0, 5))
      };
  
      search();
     }, 400)
  
    return () => clearTimeout(timer)
  }, [startingPoint])

  const checkStartingPoint = () => {
    if (startingPoint === "") return
    onNext()
  }

  return (
    <div>
      <div>
        <label htmlFor="startingPoint">
          <p>Da dove parti</p>
        </label>
        <div className={styles.inputContainer}>
        <input
          type="text"
          id="startingPoint"
          name="startingPoint"
          value={startingPoint}
          onChange={(e) => setStartingPoint(e.target.value)}
        />
        
        {loading && <p>Sto cercando...</p>}
        {suggestion.length > 0 && (
        <div className={styles.dropdown}>
          {suggestion.map((s) => (
            <div key={s.place_id} className={styles.dropdownItem} onClick={() => selectSuggestion(s)}>
              {s.display_name}
            </div>
          ))}
        </div>
      )}</div>
        <button onClick={checkStartingPoint}>Avanti</button>
      </div>
    </div>
  );
}