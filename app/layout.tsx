import './globals.css'
import './styles/fonts.css'
import { ReactNode } from 'react'
import { Metadata } from 'next'
import ClientLayout from './components/ClientLayout'
import { Prompt } from 'next/font/google'

const prompt = Prompt({
  subsets: ['thai'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Football Prediction',
  description: 'กิจกรรมทายผลฟุตบอล Next.js 15 Example',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className={prompt.className}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}