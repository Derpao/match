import { unstable_cache } from 'next/cache'
import { supabase } from './supabaseClient'
import { Match } from './types'

export const getMatches = unstable_cache(
  async () => {
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
  ['matches'],
  { 
    tags: ['matches'],
    revalidate: 7200 // 2 hours in seconds
  }
)

export const getMatch = unstable_cache(
  async (id: string) => {
    const matches = await getMatches()
    return matches.find(m => m.id === Number(id))
  },
  ['match'],
  {
    tags: ['matches'],
    revalidate: 7200
  }
)
