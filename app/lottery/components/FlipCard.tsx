'use client'

import { useEffect, useState } from 'react'
import styles from './FlipCard.module.css'

interface FlipCardProps {
  digit: number
  label: string
  previousDigit: number
}

export default function FlipCard({ digit, label, previousDigit }: FlipCardProps) {
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (previousDigit !== digit) {
      setIsFlipping(true)
      const timer = setTimeout(() => setIsFlipping(false), 600)
      return () => clearTimeout(timer)
    }
  }, [digit, previousDigit])

  return (
    <div className={`${styles.flipCard} ${isFlipping ? styles.flip : ''}`}>
      <div className={styles.top}>{digit}</div>
      <div className={styles.bottom}>{digit}</div>
      {isFlipping && (
        <>
          <div className={styles.flipTop}>{previousDigit}</div>
          <div className={styles.flipBottom}>{digit}</div>
        </>
      )}
      <div className={styles.label}>{label}</div>
    </div>
  )
}
