import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { Match } from '@/lib/types'

export const runtime = 'edge' // Use edge runtime for better performance

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('matches_insert')
      .select(`
        id,
        teams_info,
        matchtime
      `)
      .order('matchtime', { ascending: true })
      .limit(10) // Limit initial load
      .range(0, 9)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ data: [] })
    }

    const formattedData: Match[] = data.map((item) => ({
      id: item.id,
      teams: {
        teamA: item.teams_info.teamA,
        teamB: item.teams_info.teamB,
        logoA: item.teams_info.logoA,
        logoB: item.teams_info.logoB
      },
      matchTime: item.matchtime,
      image: '/images/10000.webp' // Add static image path
    }))

    return NextResponse.json({ data: formattedData })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}