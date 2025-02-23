'use client'

import { Suspense } from 'react'
import Loading from '../games/loading'
import LotteryCard from './components/LotteryCard'
import styles from './styles/waviy.module.css'
import { getCurrentLottery } from './utils'

function Lottery() {
  const currentLottery = getCurrentLottery()
  
  return (
    <div className="w-full">
      <h1 className={styles.waviy}>รายการหวยงวดล่าสุด</h1>
      <div className="flex flex-col gap-4">
        <LotteryCard currentLottery={currentLottery} />
      </div>
    </div>
  )
}

export default function GamesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Lottery />
    </Suspense>
  )
}