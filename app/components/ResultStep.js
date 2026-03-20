import { useEffect, useState } from "react";
import styles from "./ResultStep.module.css";

export default function ResultsStep({
  startingPoint,
  startCoords,
  cities,
  interests,
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
      // trova il posto più vicino alla posizione corrente
      let nearestIndex = 0;
      let nearestDist = Infinity;

      remaining.forEach((place, i) => {
        const dist = Math.sqrt(
          Math.pow(place.lat - currentLat, 2) +
            Math.pow(place.lon - currentLon, 2),
        );
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIndex = i;
        }
      });

      // aggiungi il più vicino e aggiorna posizione corrente
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
        body: JSON.stringify({ startingPoint, startCoords, cities, interests }),
      });
      const data = await response.json();
      const optimized = optimizeRoute(data.places, startCoords)
      setPlaces(optimized)
      setLoading(false);
    };
    fetchResults();
  }, []);

  const buildRouteUrl = () => {
    const origin = encodeURIComponent(startingPoint);
    const destination = encodeURIComponent(
      `${places[places.length - 1].name}, ${places[places.length - 1].city}`,
    );
    const waypoints = places
      .slice(0, -1)
      .map((p) => encodeURIComponent(`${p.name}, ${p.city}`))
      .join("|");
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=walking`;
  };

  return (
    <div>
      {loading ? (
        <p>Generando il tuo itinerario...</p>
      ) : (
        <div>
          {places.map((p, index) => (
            <div key={index} className={styles.card}>
              {/* riga superiore: numero, nome, città */}
              <div className={styles.cardHeader}>
                <span>{index + 1}</span>
                <h3>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + " " + p.city)}`}
                    target="_blank"
                  >
                    {p.name}
                  </a>
                </h3>
                <span className={styles.badge}>{p.city}</span>
              </div>

              {/* descrizione */}
              <p>{p.description}</p>

              {/* orari e tempo visita */}
              <div className={styles.meta}>
                <span>
                  <i>
                    <b>Orario d'apertura:</b>
                  </i>{" "}
                  {p.opening_hours}
                </span>
                <span>
                  <i>
                    <b>Visita media:</b>
                  </i>{" "}
                  {p.avg_visit_time}
                </span>
              </div>

              {/* tag */}
              <div className={styles.tags}>
                {p.tags.map((tag, i) => (
                  <span key={i} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}{" "}
          <a href={buildRouteUrl()} target="_blank">
            Apri percorso completo in Google Maps
          </a>
        </div>
      )}
    </div>
  );
}
