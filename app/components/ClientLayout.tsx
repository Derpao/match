'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import BackButton from './BackButton'

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <div className={`
      min-h-screen mx-auto bg-white
      ${isAdmin ? 'w-[800px]' : 'w-full md:w-[400px]'}
    `}>
      {!isAdmin && (
        <header className="bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 px-4 min-h-[80px] flex items-center text-white shadow-lg">
          <div className="relative flex items-center justify-center w-full">
            <div className="absolute left-1">
              <div className="p-3 px-4 hover:bg-white/10 active:bg-white/20 rounded-xl transition-colors cursor-pointer">
                <BackButton />
              </div>
            </div>
            <h1 className="flex-1 text-center text-2xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
              Football Prediction
            </h1>
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
