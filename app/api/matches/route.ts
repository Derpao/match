import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { Match } from '@/lib/types'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('matches_insert')
      .select(`
        id,
        teams_info,
        matchtime,
        image
      `)
      .order('matchtime', { ascending: true })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    if (!data) {
      return NextResponse.json(
        { data: [] },
        { headers: { 'Cache-Control': 'no-store' } }
      )
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
      image: item.image
    }))

    return NextResponse.json(
      { data: formattedData },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}