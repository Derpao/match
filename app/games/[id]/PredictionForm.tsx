'use client'

import { useState, FormEvent, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PHONE_REGEX, MAX_SCORE, MIN_SCORE } from '@/lib/constants'
import { supabase } from '@/lib/supabaseClient'
import { canPredictMatch, getMatchClosingTime } from '@/lib/displayDateUtils'
import SuccessModal from './components/SuccessModal'
import FormContent from './components/FormContent'
import TermsAndConditions from './components/TermsAndConditions'
import PredictionStats from './components/PredictionStats'

interface PredictionFormProps {
  matchId: number
  teamNames: {
    teamA: string
    teamB: string
  }
  matchTime: string
}

// Fixed unique integer counts for each score combination.
// These 16 values are unique and between 140 and 155.
const FIXED_COUNTS: number[] = [
  141, 140, 142, 143,
  144, 145, 146, 147,
  148, 149, 150, 151,
  152, 153, 154, 155
]

const SCORE_COMBINATIONS = [
  { scoreA: 0, scoreB: 0 },
  { scoreA: 0, scoreB: 1 },
  { scoreA: 0, scoreB: 2 },
  { scoreA: 0, scoreB: 3 },
  { scoreA: 1, scoreB: 1 },
  { scoreA: 1, scoreB: 0 },
  { scoreA: 1, scoreB: 2 },
  { scoreA: 1, scoreB: 3 },
  { scoreA: 2, scoreB: 1 },
  { scoreA: 2, scoreB: 0 },
  { scoreA: 2, scoreB: 2 },
  { scoreA: 2, scoreB: 3 },
  { scoreA: 3, scoreB: 0 },
  { scoreA: 3, scoreB: 1 },
  { scoreA: 3, scoreB: 2 },
  { scoreA: 3, scoreB: 3 }
]

export default function PredictionForm({ matchId, teamNames, matchTime }: PredictionFormProps) {
  const router = useRouter()
  const [scoreA, setScoreA] = useState('')
  const [scoreB, setScoreB] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const isPredictionAllowed = canPredictMatch(matchTime)
  const closingTime = getMatchClosingTime(matchTime)

  // Load phone number from localStorage on mount
  useEffect(() => {
    const savedPhone = localStorage.getItem('lastPhoneNumber')
    if (savedPhone) {
      setPhoneNumber(savedPhone)
    }
  }, [])

  const validateForm = (): boolean => {
    if (!phoneNumber.match(PHONE_REGEX)) {
      setError('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง')
      return false
    }
    
    if (!isPredictionAllowed) {
      setError(`ไม่สามารถทายผลได้ เนื่องจากต้องทำนายก่อนเวลา ${closingTime}`)
      return false
    }

    const scoreANum = parseInt(scoreA)
    const scoreBNum = parseInt(scoreB)
    
    if (isNaN(scoreANum) || isNaN(scoreBNum)) {
      setError('กรุณากรอกสกอร์ให้ถูกต้อง')
      return false
    }

    return true
  }

  const checkExistingPrediction = async (matchId: number, phoneNumber: string) => {
    // แปลง matchTime เป็น Date object
    const matchDate = new Date(matchTime)
    const startOfDay = new Date(matchDate.getFullYear(), matchDate.getMonth(), matchDate.getDate())
    const endOfDay = new Date(matchDate.getFullYear(), matchDate.getMonth(), matchDate.getDate() + 1)

    // ดึงข้อมูลการทายทั้งหมดของวันนั้น
    const { data, error } = await supabase
      .from('MatchPredict')
      .select('id, team_a, team_b, submission_time')
      .eq('phone_number', phoneNumber)
      .gte('submission_time', startOfDay.toISOString())
      .lt('submission_time', endOfDay.toISOString())

    if (error) {
      console.error('Error checking prediction:', error)
      throw new Error('ไม่สามารถตรวจสอบข้อมูลได้')
    }

    // ถ้ามีข้อมูลการทายในวันนั้น
    if (data && data.length > 0) {
      // เช็คว่าเป็นแมตช์เดิมหรือไม่
      const sameMatch = data.find(prediction => prediction.id === matchId)
      if (sameMatch) {
        return sameMatch
      }
      // ถ้าเป็นแมตช์อื่นในวันเดียวกัน
      return {
        id: data[0].id,
        team_a: data[0].team_a,
        team_b: data[0].team_b,
        isOtherMatch: true
      }
    }

    return null
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    try {
      // Check for existing prediction first
      const existing = await checkExistingPrediction(matchId, phoneNumber)
      if (existing) {
        if ('isOtherMatch' in existing && existing.isOtherMatch) {
          setError(`คุณได้ทำนายผลการแข่งขันของแมตช์ ${existing.team_a} VS ${existing.team_b} ในวันนี้ไปแล้ว คุณสามารถทำนายแมตช์ที่แข่งขันในวันเดียวกันได้เพียง 1 แมตช์เท่านั้น`)
        } else {
          setError(`คุณได้ทำนายผลการแข่งขัน ${existing.team_a} VS ${existing.team_b} ไปแล้ว`)
        }
        return
      }

      const { error } = await supabase
        .from('MatchPredict')
        .insert({
          match_id: matchId,
          team_a: teamNames.teamA,
          team_b: teamNames.teamB,
          score_a: parseInt(scoreA),
          score_b: parseInt(scoreB),
          phone_number: phoneNumber,
          submission_time: matchTime  // Use matchTime instead of current time
        })
        .select()

      if (error) {
        if (error.code === '23505') { // Unique violation error code
          setError(`คุณได้ทำนายผลการแข่งขัน ${teamNames.teamA} VS ${teamNames.teamB} ไปแล้ว`)
          return
        }
        console.error('Supabase error details:', {
          code: error.code,
          message: error.message,
          details: error.details
        })
        throw new Error(`Failed to save prediction: ${error.message}`)
      }

      // Save phone number to localStorage after successful submission
      localStorage.setItem('lastPhoneNumber', phoneNumber)
      setShowSuccess(true) // Replace alert with modal
      // Don't redirect immediately, let user close the modal
    } catch (err) {
      console.error('Error saving prediction:', err)
      setError('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalClose = () => {
    setShowSuccess(false)
    router.push('/games')
  }

  const handleScoreChange = (value: string, setter: (value: string) => void) => {
    const num = value === '' ? '' : Math.min(Math.max(parseInt(value) || 0, MIN_SCORE), MAX_SCORE).toString()
    setter(num)
  }

  // Add a helper function for a deterministic shuffle using a numeric seed.
  function seededShuffle(array: number[], seed: number): number[] {
    const result = [...array];
    let currentIndex = result.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
      seed = (seed * 9301 + 49297) % 233280;
      randomIndex = Math.floor((seed / 233280) * currentIndex);
      currentIndex--;
      temporaryValue = result[currentIndex];
      result[currentIndex] = result[randomIndex];
      result[randomIndex] = temporaryValue;
    }
    return result;
  }

  // Use the match's unique properties to create a seed.
  const seed =
    parseInt(matchId.toString()) +
    teamNames.teamA.charCodeAt(0) +
    teamNames.teamB.charCodeAt(0);

  // Shuffle the fixed counts deterministically.
  const shuffledCounts = seededShuffle(FIXED_COUNTS, seed);

  // Map each score combination to a unique count from the shuffled array.
  const predictionStats = useMemo(() => {
    return SCORE_COMBINATIONS.map((score, index) => ({
      ...score,
      count: shuffledCounts[index] // Unique count per score pair for this match
    }));
  }, [shuffledCounts]);

  return (
    <>
      <FormContent
        teamNames={teamNames}
        scoreA={scoreA}
        scoreB={scoreB}
        phoneNumber={phoneNumber}
        isPredictionAllowed={isPredictionAllowed}
        isSubmitting={isSubmitting}
        error={error}
        closingTime={closingTime}
        onScoreAChange={(e) => handleScoreChange(e.target.value, setScoreA)}
        onScoreBChange={(e) => handleScoreChange(e.target.value, setScoreB)}
        onPhoneChange={(e) => setPhoneNumber(e.target.value)}
        onSubmit={handleSubmit}
      />
      
      <TermsAndConditions />
      
      <PredictionStats
        teamA={teamNames.teamA}
        teamB={teamNames.teamB}
        stats={predictionStats}
      />
      
      <SuccessModal 
        isOpen={showSuccess} 
        onClose={handleModalClose}
      />
    </>
  )
}
