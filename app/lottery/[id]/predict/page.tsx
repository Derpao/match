'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import styles from './PredictPage.module.css'
import { getCurrentLottery } from '../../utils'  // Updated import path
import Loading from '@/app/games/loading'
import CountdownTimer from '@/components/CountdownTimer'
import { supabase } from '@/lib/supabaseClient'
import { Prediction } from '@/types/prediction'
import SuccessModal from '@/components/SuccessModal'
import TermsAndConditions from '@/components/TermsAndConditions'
import PredictionStats from '@/components/PredictionStats'

// เพิ่มฟังก์ชันแปลงวันที่ไทยเป็น ISO format
const convertThaiDateToISO = (thaiDate: string) => {
  const thaiMonths: { [key: string]: string } = {
    'มกราคม': '01', 'กุมภาพันธ์': '02', 'มีนาคม': '03', 'เมษายน': '04',
    'พฤษภาคม': '05', 'มิถุนายน': '06', 'กรกฎาคม': '07', 'สิงหาคม': '08',
    'กันยายน': '09', 'ตุลาคม': '10', 'พฤศจิกายน': '11', 'ธันวาคม': '12'
  }

  const [day, month, year] = thaiDate.split(' ')
  const monthNum = thaiMonths[month]
  const gregorianYear = parseInt(year) - 543
  return `${gregorianYear}-${monthNum}-${day.padStart(2, '0')}`
}

// เพิ่มฟังก์ชันตรวจสอบการทายซ้ำ
const checkExistingPrediction = async (phoneNumber: string, lotteryDate: string) => {
  const { data, error } = await supabase
    .from('predictions')
    .select('id, created_at')
    .eq('lottery_date', lotteryDate)
    .eq('phone_number', phoneNumber)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    throw new Error('เกิดข้อผิดพลาดในการตรวจสอบข้อมูล')
  }

  return {
    exists: data !== null,
    submittedAt: data?.created_at ? new Date(data.created_at).toLocaleString('th-TH') : null
  }
}

export default function PredictPage() {
  const router = useRouter()
  const [prediction, setPrediction] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const lotteryData = getCurrentLottery()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const savedPhone = localStorage.getItem('userPhone')
    if (savedPhone) {
      setPhoneNumber(savedPhone)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const isoDate = convertThaiDateToISO(lotteryData.date)
      
      // ตรวจสอบการทายซ้ำ
      const { exists, submittedAt } = await checkExistingPrediction(phoneNumber, isoDate)
      if (exists) {
        throw new Error(
          `หมายเลขโทรศัพท์ ${phoneNumber} ได้ทำการทายผลไปแล้ว\nเมื่อ ${submittedAt}`
        )
      }

      // บันทึกข้อมูลการทาย
      const predictionData: Prediction = {
        prediction_number: prediction,
        phone_number: phoneNumber,
        lottery_date: isoDate,
      }

      const { error: insertError } = await supabase
        .from('predictions')
        .insert(predictionData)

      if (insertError) {
        if (insertError.code === '23505') { // unique violation
          throw new Error('คุณได้ทายผลสำหรับงวดนี้ไปแล้ว')
        }
        throw insertError
      }

      // บันทึก phone number ลง localStorage
      localStorage.setItem('userPhone', phoneNumber)
      
      // รีเซ็ตฟอร์มและแสดงข้อความสำเร็จ
      setPrediction('')
      setIsModalOpen(true) // เปิด modal แทน alert

    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    const value = e.target.value
    if (value === '' || /^\d+$/.test(value)) {
      setter(value)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    router.push('/') // redirect to home page
  }

  if (!lotteryData) {
    return <Loading />
  }

  const currentLottery = getCurrentLottery()

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <Image
            src="/images/10006.webp"
            alt="Lottery Prediction"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            style={{ objectFit: 'cover' }}
            className={styles.image}
          />
        </div>
        <h1 className={styles.title}>ทายผลรางวัลเลข 2 ตัวล่าง</h1>
        <h2 className={styles.subtitle}>
          งวดวันที่ {lotteryData?.date || ''}
        </h2>
        
        {!currentLottery.isDrawing && (
          <>
            <div className="text-center text-gray-600 mt-4">เวลาที่เหลือก่อนออกผล</div>
            <CountdownTimer targetDate={currentLottery.targetDate} />
          </>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {currentLottery.isDrawing ? (
          <div className="text-red-500">
            ขณะนี้อยู่ในช่วงการออกผลรางวัล กรุณารอสักครู่
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="prediction" className={styles.label}>
                  กรอกเลข 2 ตัว
                </label>
                <input
                  id="prediction"
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  pattern="\d{2}"
                  value={prediction}
                  onChange={(e) => handleNumberInput(e, setPrediction)}
                  className={styles.input}
                  placeholder="00-99"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="phone" className={styles.label}>
                  เบอร์โทรศัพท์
                </label>
                <input
                  id="phone"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => handleNumberInput(e, setPhoneNumber)}
                  className={`${styles.input} ${styles.phoneInput}`}
                  placeholder="0812345678"
                  required
                />
              </div>
              <button 
                type="submit" 
                className={`${styles.submitButton} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'กำลังบันทึก...' : 'ส่งคำตอบ'}
              </button>
            </form>
            <TermsAndConditions />
            <PredictionStats />
          </>
        )}
      </div>
      
     
      
      <SuccessModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  )
}
