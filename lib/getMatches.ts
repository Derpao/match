import { cache } from 'react'
import { supabase } from './supabaseClient'
import { Match } from './types'

// Remove in-memory cache variables
// let matchesCache: Match[] | null = null
// let lastFetchTime: number | null = null
// const CACHE_DURATION = 2 * 60 * 60 * 1000 // 2 hours

export const getMatches = cache(async () => {
  try {
    // Remove cache check
    // if (matchesCache && lastFetchTime && Date.now() - lastFetchTime < CACHE_DURATION) {
    //   console.log('Returning cached matches data')
    //   return matchesCache
    // }

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

    if (error) {
      console.error('Supabase error:', error)
      throw new Error('Failed to fetch matches from Supabase')
    }

    if (!data) {
      console.warn('No matches data returned from Supabase')
      return [] // Return an empty array to avoid errors
    }

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

    // Remove cache update
    // matchesCache = matches
    // lastFetchTime = Date.now()

    return matches
  } catch (error) {
    console.error('Error in getMatches:', error)
    return [] // Return an empty array to prevent the app from crashing
  }
})

// let matchCache: Record<string, Match> = {} // Remove this line

// Add this function to clear cache
export const clearMatchesCache = () => {
  // matchesCache = null; // Remove this line
  // lastFetchTime = null; // Remove this line
  // matchCache = {}; // Remove this line
  console.log('Matches cache cleared');
}

export const getMatch = cache(async (id: string) => {
  // Check if specific match is cached
  // if (matchCache[id]) { // Remove this line
  //   console.log(`Returning cached match data for ID: ${id}`) // Remove this line
  //   return matchCache[id] // Remove this line
  // } // Remove this line

  const matches = await getMatches()
  const match = matches.find(m => m.id === Number(id))
  
  // if (match) { // Remove this line
  //   matchCache[id] = match // Remove this line
  // } // Remove this line
  
  return match
})
