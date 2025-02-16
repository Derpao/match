'use client'

import { usePathname } from 'next/navigation'

export default function BackButton() {
  const pathname = usePathname()

  if (pathname === '/') return null

  return (
    <div className="w-full h-full flex items-center justify-start">
      <div className="flex items-center gap-1 px-1">
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
      </div>
    </div>
  )
}
