import Image from 'next/image'
import Link from 'next/link'
import { formatDisplayMatchTime } from '@/lib/displayDateUtils'
import { Match } from '@/types/match'
import styles from '../styles/match-card.module.css'
import { isPredictionClosed } from '@/lib/matchTimeUtils'

type MatchCardProps = {
  match: Match
}

export default function MatchCard({ match }: MatchCardProps) {
  const isDisabled = isPredictionClosed(match.matchTime);
  
  const Content = (
    <div className={`border-gray-100 rounded-lg overflow-hidden ${styles.matchCardInner} ${styles.matchCardTeam}`}>
      <div className="h-[200px] relative">
        <Image
          src="/images/10004.webp"
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
                unoptimized
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
                unoptimized
              />
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          เวลาแข่ง: {formatDisplayMatchTime(match.matchTime)}
        </p>
      </div>
    </div>
  )

  if (isDisabled) {
    return (
      <div className={`block ${styles.matchCard} cursor-not-allowed opacity-70`} title="ปิดรับการทายผล">
        {Content}
      </div>
    )
  }

  return (
    <Link 
      href={`/games/${match.id}`} 
      className={`block ${styles.matchCard}`}
    >
      {Content}
    </Link>
  )
}