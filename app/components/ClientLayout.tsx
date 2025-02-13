'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import BackButton from './BackButton'

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <div className="min-h-screen mx-auto bg-white" style={{ width: isAdmin ? '800px' : '375px' }}>
      {!isAdmin && (
        <header className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 pt-12 pb-4 text-white">
          <div className="relative flex items-center justify-center">
            <BackButton />
            <h2 className="text-xl font-bold">Football Prediction</h2>
          </div>
        </header>
      )}

      <main className="p-4 min-h-[80vh] bg-white">
        {children}
      </main>

      {!isAdmin && (
        <footer className="text-center p-4 bg-white border-t border-gray-100">
          <small>© 2025 My Football Prediction</small>
        </footer>
      )}
    </div>
  )
}
