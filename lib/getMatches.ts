import { cache } from 'react'
import { Match } from './types'

export const revalidate = 300 // Revalidate every 5 minutes

export const getMatches = cache(async () => {
  const host = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  const res = await fetch(`${host}/api/matches`, {
    next: { revalidate }
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch matches')
  }
  
  const { data } = await res.json()
  return data as Match[]
})
