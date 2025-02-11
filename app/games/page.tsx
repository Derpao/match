import Link from 'next/link'
import { Match } from '@/lib/types'
import { formatMatchTime } from '@/lib/utils'
import { headers } from 'next/headers'

async function getMatches(): Promise<Match[]> {
  try {
    // Add artificial delay in development to see loading state
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Get host from headers
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'production' ? 'http' : 'http'
    
    const res = await fetch(`${protocol}://${host}/api/matches`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      const errorText = await res.text()
      console.error('API Error:', errorText)
      throw new Error('Failed to fetch matches')
    }
    
    const { data } = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching matches:', error)
    return []
  }
}

export default async function GamesPage() {
  // เรียกฟังก์ชัน getMatches() ดึงข้อมูลคู่ฟุตบอล
  const matches = await getMatches()

  if (!matches || matches.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-gray-600">ไม่พบข้อมูลการแข่งขัน111</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h1 className="text-xl font-bold mb-4 text-gray-800">รายการคู่ฟุตบอล</h1>
      <div className="flex flex-col gap-4">
        {matches?.map((m) => (
          <Link 
            href={`/games/${m.id}`} 
            key={m.id}
            className="block"
          >
            <div className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow">
              <div className="h-[160px]">
                <img
                  src="/images/10000.webp"
                  alt={`${m.teams?.teamA || 'Team A'} vs ${m.teams?.teamB || 'Team B'}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <img 
                      src={m.teams.logoA} 
                      alt={m.teams.teamA}
                      className="w-8 h-8 object-contain"
                    />
                    <span className="mx-2 font-bold">{m.teams.teamA}</span>
                  </div>
                  <span className="mx-1 text-blue-600">VS</span>
                  <div className="flex items-center">
                    <span className="mx-2 font-bold">{m.teams.teamB}</span>
                    <img 
                      src={m.teams.logoB} 
                      alt={m.teams.teamB}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  เวลาแข่ง: {formatMatchTime(m.matchTime)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}