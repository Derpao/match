'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const PredictionForm = dynamic(() => import('./PredictionForm'), {
  ssr: false,
})

interface ClientFormWrapperProps {
  matchId: number
  teamNames: {
    teamA: string
    teamB: string
  }
  matchTime: string  // Add this prop
}

export default function ClientFormWrapper({ matchId, teamNames, matchTime }: ClientFormWrapperProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PredictionForm matchId={matchId} teamNames={teamNames} matchTime={matchTime} />
    </Suspense>
  )
}
