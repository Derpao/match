'use client'

import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import BackButton from './BackButton'
import Image from 'next/image'

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  const [logoPath, setLogoPath] = useState<string | null>(null)

  useEffect(() => {
    const referrer = document.referrer
    if (referrer && new URL(referrer).hostname.includes('banker999')) {
      setLogoPath('/images/banker999.png')
    } else {
      setLogoPath('/images/20240219123410YMrf (1).png')
    }
  }, [])

  return (
    <div className={`
      min-h-screen mx-auto bg-white
      ${isAdmin ? 'w-[800px]' : 'w-full md:w-[400px]'}
    `}>
      {!isAdmin && (
        <header className="bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 px-4 min-h-[80px] flex items-center text-white shadow-lg">
          <div className="relative flex items-center w-full">
            <div className="absolute left-0 p-3 px-4 active:bg-white/20 rounded-xl transition-colors cursor-pointer">
              <BackButton />
            </div>
            <div className="flex-1 flex justify-center items-center">
              {logoPath && (
                <Image
                  src={logoPath}
                  alt="ทายฟุตผลบอล"
                  width={200}
                  height={60}
                  className="object-contain"
                  priority
                />
              )}
            </div>
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
