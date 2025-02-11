import { NextResponse } from 'next/server'
import { Match } from '@/lib/types'

const MATCHES: Match[] = [
  { 
    id: 1, 
    teams: {
      teamA: 'Barcelona',
      teamB: 'Real Madrid',
      logoA: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
      logoB: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg'
    },
    matchTime: '2025-02-11 05:00',
    image: 'https://theme-ui.s3.ap-southeast-1.amazonaws.com/activity/football/79530d1b-8b4e-48f0-83be-ee5e82c5bd7d'
  },
  { 
    id: 2, 
    teams: {
      teamA: 'Liverpool',
      teamB: 'Man City',
      logoA: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
      logoB: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg'
    },
    matchTime: '2025-02-16 23:00',
    image: 'https://theme-ui.s3.ap-southeast-1.amazonaws.com/activity/football/79530d1b-8b4e-48f0-83be-ee5e82c5bd7d'
  },
  { 
    id: 3,
    teams: {
      teamA: 'PSG',
      teamB: 'Bayern Munich',
      logoA: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg',
      logoB: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg'
    },
    matchTime: '2025-02-18 02:00',
    image: 'https://theme-ui.s3.ap-southeast-1.amazonaws.com/activity/football/79530d1b-8b4e-48f0-83be-ee5e82c5bd7d'
  },
]

export async function GET() {
  try {
    return NextResponse.json({ data: MATCHES })
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}