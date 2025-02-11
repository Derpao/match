import Link from 'next/link'
import { Match } from '@/lib/types'
import { formatMatchTime } from '@/lib/utils'

// ใช้ fetch ข้อมูลคู่ฟุตบอลจาก API ที่เราจะสร้าง
async function getMatches(): Promise<Match[]> {
  try {
    const res = await fetch('http://localhost:3000/api/matches', {
      // ถ้าเป็น Production / Deploy จริง ให้ใช้ URL ของ server ที่แท้จริง
      cache: 'no-store' 
      // อาจใช้ 'force-cache' หรือ 'no-cache' ตามการใช้งาน
    })
    if (!res.ok) throw new Error('Failed to fetch matches')
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
        <p className="text-gray-600">ไม่พบข้อมูลการแข่งขัน</p>
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
                  src={m.image}
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