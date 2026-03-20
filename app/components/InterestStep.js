import styles from './InterestStep.module.css'

const INTERESTS = [
  { id: "art", name: "Arte", image: "/interests/art.jpg" },
  { id: "music", name: "Musica", image: "/interests/music.jpg" },
  { id: "food", name: "Gastronomia", image: "/interests/food.jpg" },
  { id: "history", name: "Storia", image: "/interests/history.jpg" },
  { id: "architecture", name: "Architettura", image: "/interests/architecture.jpg" },
  { id: "nature", name: "Natura", image: "/interests/nature.jpg" },
  { id: "cinema", name: "Cinema", image: "/interests/cinema.jpg" },
  { id: "shopping", name: "Shopping", image: "/interests/shopping.jpg" },
  { id: "nightlife", name: "Vita notturna", image: "/interests/nightlife.jpg" },
  { id: "sport", name: "Sport", image: "/interests/sport.jpg" },
]



export default function InterestStep({ interests, setInterests, onNext, onBack}) {

    const toggleInterest = (id) => {
      setInterests(
        interests.includes(id)
          ? interests.filter((i) => i !== id)
          : [...interests, id],
      );
    };

    return (
      <div>
        <h3>Cosa ti interessa?</h3> 
        <div className={styles.grid}>
          {INTERESTS.map((i) => (
            <div
              key={i.id}
              className={`${styles.card} ${interests.includes(i.id) ? styles.selected : ""}`}
              style={{ backgroundImage: `url(${i.image})` }}
              onClick={() => toggleInterest(i.id)}
            >
              <div className={styles.overlay}>
                <p className={styles.cardName}>{i.name}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onBack}>Indietro</button>
        <button disabled={interests.length===0} onClick={onNext}>Avanti</button>
      </div>
    );
}