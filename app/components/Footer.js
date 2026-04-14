'use client'

import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeft}>
        <span className={styles.footerLogo}>Travel Planner</span>
        <p className={styles.footerSub}>Itinerari personalizzati con AI</p>
      </div>
      <div className={styles.footerLinks}>
        <strong>Menu</strong>
        <a href="/">Home</a>
        <a href="#">Privacy</a>
      </div>
      <div className={styles.footerLinks}>
        <strong>Contatti</strong>
        <a href="#" onClick={() => window.open('mailto:luca.mostacci@gmail.com')}>Email</a>
        <a href="https://github.com/lucamostacci/travel-planner" target="_blank">GitHub</a>
        <a href="https://www.linkedin.com/in/luca-mostacci/" target="_blank">LinkedIn</a>
      </div>
    </footer>
  )
}