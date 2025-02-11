// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import { Metadata } from 'next'
import BackButton from './components/BackButton'

// ตั้งค่าข้อมูล Meta (Title, Description) ระดับ Global
export const metadata: Metadata = {
  title: 'Football Prediction',
  description: 'กิจกรรมทายผลฟุตบอล Next.js 15 Example',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen mx-auto bg-white" style={{ width: '375px' }}>
          <header className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-12 pb-4 text-white">
            <div className="relative flex items-center justify-center">
              <BackButton />
              <h2 className="text-xl font-bold">Football Prediction</h2>
            </div>
          </header>

          <main className="p-4 min-h-[80vh] bg-white">
            {children}
          </main>

          <footer className="text-center p-4 bg-white border-t border-gray-100">
            <small>© 2025 My Football Prediction</small>
          </footer>
        </div>
      </body>
    </html>
  )
}