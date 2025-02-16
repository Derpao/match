'use client'

import styles from './FlipDown.module.css'

interface FlipDownProps {
  hours: number
  minutes: number
  seconds: number
  isLoading?: boolean
}

export default function FlipDown({ hours, minutes, seconds, isLoading = true }: FlipDownProps) {
  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  if (isLoading) {
    return (
      <div className={styles.flipDown}>
        <div className={styles.timeUnit}>
          <div className={`${styles.digit} ${styles.loading}`}>-</div>
          <div className={styles.label}>ชั่วโมง</div>
        </div>
        <div className={styles.separator}>:</div>
        <div className={styles.timeUnit}>
          <div className={`${styles.digit} ${styles.loading}`}>-</div>
          <div className={styles.label}>นาที</div>
        </div>
        <div className={styles.separator}>:</div>
        <div className={styles.timeUnit}>
          <div className={`${styles.digit} ${styles.loading}`}>-</div>
          <div className={styles.label}>วินาที</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.flipDown}>
      <div className={styles.timeUnit}>
        <div className={styles.digit}>{formatNumber(hours)}</div>
        <div className={styles.label}>ชั่วโมง</div>
      </div>
      <div className={styles.separator}>:</div>
      <div className={styles.timeUnit}>
        <div className={styles.digit}>{formatNumber(minutes)}</div>
        <div className={styles.label}>นาที</div>
      </div>
      <div className={styles.separator}>:</div>
      <div className={styles.timeUnit}>
        <div className={styles.digit}>{formatNumber(seconds)}</div>
        <div className={styles.label}>วินาที</div>
      </div>
    </div>
  )
}
