export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatMatchTime } from '@/lib/utils'
import { getMatches } from '@/lib/getMatches'
import Loading from './loading'

async function MatchList() {
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
              <div className="h-[160px] relative">
                <Image
                  src="/images/10000.webp"
                  alt={`${m.teams?.teamA || 'Team A'} vs ${m.teams?.teamB || 'Team B'}`}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="relative w-8 h-8">
                      <Image 
                        src={m.teams.logoA} 
                        alt={m.teams.teamA}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="mx-2 font-bold">{m.teams.teamA}</span>
                  </div>
                  <span className="mx-1 text-blue-600">VS</span>
                  <div className="flex items-center">
                    <span className="mx-2 font-bold">{m.teams.teamB}</span>
                    <div className="relative w-8 h-8">
                      <Image 
                        src={m.teams.logoB} 
                        alt={m.teams.teamB}
                        fill
                        className="object-contain"
                      />
                    </div>
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

export default function GamesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <MatchList />
    </Suspense>
  )
}