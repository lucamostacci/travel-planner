import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import SessionWrapper from './components/SessionWrapper'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export const metadata = {
  title: 'Travel Planner',
  description: 'Pianificatore di itinerari di viaggio basato su AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  )
}