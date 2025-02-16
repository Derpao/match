'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import FlipDown from '@/app/components/FlipDown/FlipDown'

interface CountdownTimerProps {
  matchTime: string
}

export default function CountdownTimer({ matchTime }: CountdownTimerProps) {
  const [timeData, setTimeData] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [isEnded, setIsEnded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = dayjs()
      const matchDate = dayjs(matchTime)
      const twoHoursBefore = matchDate.subtract(2, 'hours')
      const distance = twoHoursBefore.diff(now)

      if (distance < 0) {
        setIsEnded(true)
        clearInterval(timer)
        return
      }

      setTimeData({
        hours: Math.floor(distance / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      })
      setIsLoading(false)
    }, 1000)

    return () => clearInterval(timer)
  }, [matchTime])

  return (
    <div className="text-center mt-4">
      <div className="text-blue-100 mb-2">เหลือเวลาทายผล</div>
      {isEnded ? (
        <div className="text-red-400 font-bold">หมดเวลาทายผล</div>
      ) : (
        <FlipDown {...timeData} isLoading={isLoading} />
      )}
    </div>
  )
}
