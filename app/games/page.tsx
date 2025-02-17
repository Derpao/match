import { Suspense } from 'react'
import { getMatches } from '@/lib/getMatches'
import Loading from './loading'
import MatchCard from './components/MatchCard'
import styles from './styles/waviy.module.css'

async function MatchList() {
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
      <h1 className={styles.waviy}>
        รายการคู่ฟุตบอล
      </h1>
      <div className="flex flex-col gap-4">
        {matches?.map((match) => (
          <MatchCard key={match.id} match={match} />
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