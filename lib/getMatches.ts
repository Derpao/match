import { unstable_cache } from 'next/cache'
import { supabase } from './supabaseClient'
import { Match } from './types'

// Cache configuration
const CACHE_TAG = 'matches-data'

export const getMatches = async () => {
  return unstable_cache(
    async () => {
      console.log('🔄 Fetching fresh matches data')
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

      return data.map(item => ({
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
    },
    ['matches-list'],
    {
      tags: [CACHE_TAG],
      revalidate: 3600 // 1 hour
    }
  )()
}

export const getMatch = async (id: string) => {
  return unstable_cache(
    async () => {
      const matches = await getMatches()
      return matches.find(m => m.id === Number(id))
    },
    [`match-${id}`],
    {
      tags: [CACHE_TAG],
      revalidate: 3600
    }
  )()
}
