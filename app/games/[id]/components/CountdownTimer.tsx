'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import FlipDown from '@/app/components/FlipDown/FlipDown'

interface CountdownTimerProps {
  matchTime: string
}

const calculateTimeData = (matchTime: string) => {
  const now = dayjs()
  const matchDate = dayjs(matchTime)
  const twoHoursBefore = matchDate.subtract(2, 'hours')
  const distance = twoHoursBefore.diff(now)

  if (distance < 0) {
    return { isEnded: true, timeData: { hours: 0, minutes: 0, seconds: 0 } }
  }

  return {
    isEnded: false,
    timeData: {
      hours: Math.floor(distance / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    }
  }
}

export default function CountdownTimer({ matchTime }: CountdownTimerProps) {
  const [timeData, setTimeData] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [isEnded, setIsEnded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initial calculation
    const calculation = calculateTimeData(matchTime)
    setTimeData(calculation.timeData)
    setIsEnded(calculation.isEnded)
    setIsLoading(false)

    // Set up interval
    const timer = setInterval(() => {
      const calculation = calculateTimeData(matchTime)
      if (calculation.isEnded) {
        setIsEnded(true)
        clearInterval(timer)
        return
      }
      setTimeData(calculation.timeData)
    }, 1000)

    return () => clearInterval(timer)
  }, [matchTime])

  if (isLoading) {
    return <div className="text-center mt-4">
      <div className="text-blue-100 mb-2">เหลือเวลาทายผล</div>
      <FlipDown hours={0} minutes={0} seconds={0} isLoading={true} />
    </div>
  }

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
