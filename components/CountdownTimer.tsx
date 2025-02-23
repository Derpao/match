'use client'

import { useState, useEffect } from 'react'

interface CountdownProps {
  targetDate: string
}

const calculateTimeLeft = (targetDate: string) => {
  const target = new Date(targetDate).getTime()
  const now = new Date().getTime()
  const distance = target - now

  if (distance <= 0) {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00'
    }
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  return {
    days: days.toString().padStart(2, '0'),
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0')
  }
}

export default function CountdownTimer({ targetDate }: CountdownProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate))

  useEffect(() => {
    setIsLoading(false)
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (isLoading) {
    return null
  }

  return (
    <div className="flex gap-2 justify-center my-4">
      <TimeBox value={timeLeft.days} label="วัน" />
      <TimeBox value={timeLeft.hours} label="ชั่วโมง" />
      <TimeBox value={timeLeft.minutes} label="นาที" />
      <TimeBox value={timeLeft.seconds} label="วินาที" />
    </div>
  )
}

function TimeBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-black rounded-lg p-3 min-w-[80px] text-center">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-300">{label}</div>
    </div>
  )
}
