import Image from 'next/image'
import Link from 'next/link'
import { formatDisplayMatchTime } from '@/lib/displayDateUtils'
import { Match } from '@/types/match'

type MatchCardProps = {
  match: Match
}

export default function MatchCard({ match }: MatchCardProps) {
  return (
    <Link 
      href={`/games/${match.id}`} 
      className="block"
    >
      <div className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow">
        <div className="h-[200px] relative">
          <Image
            src="/images/10001.webp"
            alt={`${match.teams?.teamA || 'Team A'} vs ${match.teams?.teamB || 'Team B'}`}
            fill
            sizes="(max-width: 768px) 355px"
            className="object-cover"
            priority
            quality={75}
          />
        </div>
        
        <div className="p-3 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="relative w-8 h-8">
                <Image 
                  src={match.teams.logoA} 
                  alt={match.teams.teamA}
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <span className="mx-2 font-bold">{match.teams.teamA}</span>
            </div>
            <span className="mx-1 text-blue-600">VS</span>
            <div className="flex items-center">
              <span className="mx-2 font-bold">{match.teams.teamB}</span>
              <div className="relative w-8 h-8">
                <Image 
                  src={match.teams.logoB} 
                  alt={match.teams.teamB}
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            เวลาแข่ง: {formatDisplayMatchTime(match.matchTime)}
          </p>
        </div>
      </div>
    </Link>
  )
}