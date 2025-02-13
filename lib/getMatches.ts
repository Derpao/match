import { cache } from 'react'
import { supabase } from './supabaseClient'
import { Match } from './types'

let matchesCache: Match[] | null = null
let lastFetchTime: number | null = null
const CACHE_DURATION = 2 * 60 * 60 * 1000 // 2 hours

export const getMatches = cache(async () => {
  // Check if cache is valid
  if (matchesCache && lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
    console.log('Returning cached matches data')
    return matchesCache
  }

  console.log('Fetching fresh matches data')
  const { data, error } = await supabase
    .from('matches_insert')
    .select(`
      id,
      teams_info,
      matchtime
    `)
    .order('matchtime', { ascending: true })
    .limit(10)
    .range(0, 9)

  if (error) throw error

  const matches = data.map(item => ({
    id: item.id,
    teams: {
      teamA: item.teams_info.teamA,
      teamB: item.teams_info.teamB,
      logoA: item.teams_info.logoA,
      logoB: item.teams_info.logoB
    },
    matchTime: item.matchtime,
    image: '/images/10000.webp'
  })) as Match[]

  // Update cache
  matchesCache = matches
  lastFetchTime = Date.now()

  return matches
})

let matchCache: Record<string, Match> = {}

// Add this function to clear cache
export const clearMatchesCache = () => {
  matchesCache = null;
  lastFetchTime = null;
  matchCache = {};
  console.log('Matches cache cleared');
}

export const getMatch = cache(async (id: string) => {
  // Check if specific match is cached
  if (matchCache[id]) {
    console.log(`Returning cached match data for ID: ${id}`)
    return matchCache[id]
  }

  const matches = await getMatches()
  const match = matches.find(m => m.id === Number(id))
  
  if (match) {
    matchCache[id] = match
  }
  
  return match
})
