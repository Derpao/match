'use client'

import { usePathname } from 'next/navigation'

export function useIsAdminPath() {
  const pathname = usePathname()
  return pathname?.startsWith('/admin')
}
