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
    <main className={`${styles.container} ${styles.verticalStack}`}>
      <ScrollCard>
        <div className={styles.imageContainer}>
          <Image
            src="/images/10004.webp"
            alt="Football Prediction"
            fill
            priority={true}
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
      <ScrollCard>
        <div className={styles.imageContainer}>
          <Image
            src="/images/10005.webp"
            alt="Thai Lottery Prediction"
            fill
            loading="lazy"
            sizes="(max-width: 400px) 90vw, 400px"
            quality={90}
          />
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>กิจกรรมทายผลหวย</h1>
          <p className={styles.subtitle}>
            ร่วมสนุกทายตัวเลข ลุ้นรางวัลมากมาย
          </p>
          <Link href="/lottery">
            <Button>เริ่มทายเลข</Button>
          </Link>
        </div>
      </ScrollCard>
    </main>
  )
}