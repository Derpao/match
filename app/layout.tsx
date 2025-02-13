import './globals.css'
import { ReactNode } from 'react'
import { Metadata } from 'next'
import ClientLayout from './components/ClientLayout'

export const metadata: Metadata = {
  title: 'Football Prediction',
  description: 'กิจกรรมทายผลฟุตบอล Next.js 15 Example',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}