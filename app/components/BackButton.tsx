'use client'

import { usePathname, useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()
  const pathname = usePathname()

  if (pathname === '/') return null

  return (
    <button
      onClick={() => router.back()}
      className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-white/90 hover:text-white flex items-center gap-1 rounded-lg transition-all hover:bg-white/10"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      <span className="text-sm font-medium">กลับ</span>
    </button>
  )
}
