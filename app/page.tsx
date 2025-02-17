import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { Button } from '@/components/Button'
import { ScrollCard } from '@/components/ScrollCard'
import styles from '@/styles/Home.module.css'

export const metadata: Metadata = {
  title: 'Football Prediction - ทายผลฟุตบอล',
  description: 'ร่วมสนุกกับกิจกรรมทายผลฟุตบอล ลุ้นรางวัลใหญ่',
}

export default function Home() {
  return (
    <main className={styles.container}>
      <ScrollCard>
        <div className={styles.imageContainer}>
          <Image
            src="/images/10004.webp"
            alt="Football Prediction"
            fill
            priority
            sizes="(max-width: 400px) 90vw, 400px"
            quality={90}
          />
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>กิจกรรมทายผลฟุตบอล</h1>
          <p className={styles.subtitle}>
            ลุ้นรางวัลใหญ่กับกิจกรรมสนุก ๆ
          </p>
          <Link href="/games">
            <Button>เริ่มทายผล</Button>
          </Link>
        </div>
      </ScrollCard>
    </main>
  )
}