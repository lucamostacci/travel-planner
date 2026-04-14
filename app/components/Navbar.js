'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <nav className={styles.navbar}>
      <span className={styles.logo} onClick={() => router.push('/')}>
        Travel Planner
      </span>
      <div className={styles.navLinks}>
        {session ? (
          <>
            <a className={styles.navLink} href="/dashboard">I miei itinerari</a>
            <span className={styles.navLink}>Ciao, {session.user.name.split(' ')[0]}! 👋</span>
            <a className={styles.navLink} href="#" onClick={() => signOut()}>Esci</a>
          </>
        ) : (
          <a className={styles.navLink} href="#" onClick={() => signIn('google')}>Accedi</a>
        )}
      </div>
    </nav>
  )
}