import { useEffect, useState } from "react";
import styles from "./ResultStep.module.css";

export default function ResultsStep({
  startingPoint,
  startCoords,
  cities,
  interests,
  radius,
  onBack,
}) {
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);

  const optimizeRoute = (places, startCoords) => {
    let remaining = [...places];
    let ordered = [];
    let currentLat = parseFloat(startCoords.lat);
    let currentLon = parseFloat(startCoords.lon);

    while (remaining.length > 0) {
      let nearestIndex = 0;
      let nearestDist = Infinity;
      remaining.forEach((place, i) => {
        const dist = Math.sqrt(
          Math.pow(place.lat - currentLat, 2) +
          Math.pow(place.lon - currentLon, 2)
        );
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIndex = i;
        }
      });
      ordered.push(remaining[nearestIndex]);
      currentLat = remaining[nearestIndex].lat;
      currentLon = remaining[nearestIndex].lon;
      remaining.splice(nearestIndex, 1);
    }
    return ordered;
  };

  useEffect(() => {
    const fetchResults = async () => {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startingPoint, startCoords, cities, interests, radius }),
      });
      const data = await response.json();
      const optimized = optimizeRoute(data.places, startCoords);
      setPlaces(optimized);
      setLoading(false);
    };
    fetchResults();
  }, []);

const buildRouteUrl = () => {
  const origin = `${startCoords.lat},${startCoords.lon}`
  const destination = `${places[places.length - 1].lat},${places[places.length - 1].lon}`
  const waypoints = places
    .slice(0, -1)
    .map((p) => `${p.lat},${p.lon}`)
    .join("|")
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${encodeURIComponent(waypoints)}&travelmode=walking`
}

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Creando il tuo itinerario...</p>
          <p className={styles.loadingSub}>L'AI sta selezionando i posti migliori per te 🗺️</p>
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <h1 className={styles.title}>Il tuo itinerario ✨</h1>
            <p className={styles.subtitle}>
              {places.length} posti selezionati partendo da <strong>{startingPoint.split(",")[0]}</strong>
            </p>
          </div>
          <div className={styles.list}>
            {places.map((p, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardNumber}>{index + 1}</div>
                  <h3 className={styles.cardTitle}>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}`} target="_blank">
                      {p.name}
                    </a>
                  </h3>
                  <span className={styles.badge}>{p.city}</span>
                </div>
                <p className={styles.description}>{p.description}</p>
                <div className={styles.meta}>
                  <span className={styles.metaItem}>🕐 {p.opening_hours}</span>
                  <span className={styles.metaItem}>⏱️ {p.avg_visit_time}</span>
                </div>
                <div className={styles.tags}>
                  {p.tags.map((tag, i) => (
                    <span key={i} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className={styles.bottomNav}>
            <button className={styles.backButton} onClick={onBack}>← Modifica</button>
            <a className={styles.routeButton} href={buildRouteUrl()} target="_blank">
              🧭 Apri percorso in Google Maps
            </a>
          </div>
        </>
      )}
    </div>
  );
}