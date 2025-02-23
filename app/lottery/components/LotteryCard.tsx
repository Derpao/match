'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './LotteryCard.module.css'
import { getCurrentLottery } from '../utils'

interface LotteryCardProps {
  currentLottery: {
    id: string;
    date: string;
    isDrawing: boolean;
  }
}

export default function LotteryCard({ currentLottery: initialLottery }: LotteryCardProps) {
  const [lotteryData, setLotteryData] = useState(initialLottery)

  useEffect(() => {
    const DRAWING_INTERVAL = 5000 // 5 seconds when drawing
    const NORMAL_INTERVAL = 30000 // 30 seconds when not drawing

    const fetchData = async () => {
      const updatedLottery = getCurrentLottery()
      setLotteryData(updatedLottery)
      
      // Set the next interval based on drawing state
      const nextDelay = updatedLottery.isDrawing ? DRAWING_INTERVAL : NORMAL_INTERVAL
      const intervalType = updatedLottery.isDrawing ? 'DRAWING_INTERVAL' : 'NORMAL_INTERVAL'
      console.log(`Current interval type: ${intervalType} (${nextDelay/1000}s)`)
      timeoutId = setTimeout(fetchData, nextDelay)
    }

    console.log('Initial polling starting with NORMAL_INTERVAL')
    let timeoutId = setTimeout(fetchData, NORMAL_INTERVAL)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  const { isDrawing } = lotteryData
  
  console.log('Current isDrawing state:', isDrawing)

  const CardContent = () => (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src="/images/10006.webp"
          alt="Lottery"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          style={{ objectFit: 'cover' }}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>ทายผลเลข 2 ตัวล่าง</h2>
        <p className={`${styles.date} text-black`}>งวดวันที่ {lotteryData.date}</p>
      </div>
    </div>
  )

  if (isDrawing) {
    return (
      <div className="opacity-50 cursor-not-allowed">
        <div className={styles.cardLink}>
          <CardContent />
        </div>
        <p className="text-red-500 mt-2 text-center">
          ขณะนี้อยู่ในช่วงการออกผลรางวัล กรุณารอสักครู่
        </p>
      </div>
    )
  }

  return (
    <Link href={`/lottery/${lotteryData.id}/predict`} className={styles.cardLink}>
      <CardContent />
    </Link>
  )
}
