'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTrip, setSelectedTrip] = useState(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status])

  useEffect(() => {
    if (session) {
      fetch('/api/trips')
        .then(r => r.json())
        .then(data => {
          setTrips(data.trips || [])
          setLoading(false)
        })
    }
  }, [session])

  const deleteTrip = async (id) => {
    await fetch(`/api/trips?id=${id}`, { method: 'DELETE' })
    setTrips(trips.filter(t => t.id !== id))
  }

  if (status === 'loading' || loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner} />
      <p>Caricamento...</p>
    </div>
  )

const buildRouteUrl = (trip) => {
  const places = trip.places
  const origin = encodeURIComponent(trip.startingPoint)
  const destination = encodeURIComponent(`${places[places.length - 1].name} ${places[places.length - 1].city}`)
  const waypoints = places.slice(0, -1).map(p => encodeURIComponent(`${p.name} ${p.city}`)).join('|')
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=walking`
}

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {session?.user?.image && (
              <img src={session.user.image} alt="avatar" className={styles.avatar} />
            )}
            <div>
              <h1 className={styles.title}>I tuoi itinerari</h1>
              <p className={styles.subtitle}>Ciao, {session?.user?.name?.split(' ')[0]}! 👋</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.tripCount}>{trips.length}/3 itinerari salvati</span>
            <button className={styles.newButton} onClick={() => router.push('/')}>
              + Nuovo itinerario
            </button>
          </div>
        </div>

        {trips.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>🗺️</p>
            <h2>Nessun itinerario salvato</h2>
            <p>Genera il tuo primo itinerario e salvalo qui!</p>
            <button className={styles.newButton} onClick={() => router.push('/')}>
              Crea il primo itinerario
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {trips.map(trip => (
              <div key={trip.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{trip.title}</h3>
                  <button className={styles.deleteBtn} onClick={() => deleteTrip(trip.id)}>✕</button>
                </div>
                <p className={styles.cardLocation}>📍 {trip.startingPoint.split(',')[0]}</p>
                <div className={styles.cardTags}>
                  {trip.cities.map(c => (
                    <span key={c} className={styles.cityTag}>{c}</span>
                  ))}
                </div>
                <div className={styles.cardTags}>
                  {trip.interests.map(i => (
                    <span key={i} className={styles.interestTag}>{i}</span>
                  ))}
                </div>
                <p className={styles.cardDate}>
                  {new Date(trip.createdAt).toLocaleDateString('it-IT', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
                <div className={styles.cardFooter}>
                  <span className={styles.placesCount}>{trip.places.length} attrazioni</span>
                  <button className={styles.openBtn} onClick={() => setSelectedTrip(trip)}>
                    Apri itinerario →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTrip && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTrip(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{selectedTrip.title}</h2>
              <button onClick={() => setSelectedTrip(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              {selectedTrip.places.map((p, i) => (
                <div key={i} className={styles.modalCard}>
                  <div className={styles.modalCardHeader}>
                    <div className={styles.cardNumber}>{i + 1}</div>
<a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ' ' + p.city)}`} target="_blank">
  <h3>{p.name}</h3>
</a>
                    <span className={styles.badge}>{p.city}</span>
                  </div>
                  <p>{p.description}</p>
                  <div className={styles.meta}>
                    <span>🕐 {p.opening_hours}</span>
                    <span>⏱️ {p.avg_visit_time}</span>
                  </div>
                </div>
              ))}
              <div className={styles.modalFooter}>
  <a className={styles.routeButton} href={buildRouteUrl(selectedTrip)} target="_blank">
    🧭 Apri percorso completo in Google Maps
  </a>
</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}