'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { PHONE_REGEX, MAX_SCORE, MIN_SCORE } from '@/lib/constants'
import { supabase } from '@/lib/supabaseClient'
import { canPredictMatch, getMatchClosingTime } from '@/lib/displayDateUtils'

interface PredictionFormProps {
  matchId: number
  teamNames: {
    teamA: string
    teamB: string
  }
  matchTime: string  // Add this prop
}

export default function PredictionForm({ matchId, teamNames, matchTime }: PredictionFormProps) {
  const router = useRouter()
  const [scoreA, setScoreA] = useState('')
  const [scoreB, setScoreB] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isPredictionAllowed = canPredictMatch(matchTime)
  const closingTime = getMatchClosingTime(matchTime)

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
    const { data, error } = await supabase
      .from('MatchPredict')
      .select('id, team_a, team_b')
      .eq('match_id', matchId)
      .eq('phone_number', phoneNumber)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error checking prediction:', error)
      throw new Error('ไม่สามารถตรวจสอบข้อมูลได้')
    }

    return data
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
        setError(`คุณได้ทำนายผลการแข่งขัน ${existing.team_a} VS ${existing.team_b} ไปแล้ว`)
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

      alert('บันทึกการทายผลสำเร็จ')
      router.push('/games')
    } catch (err) {
      console.error('Error saving prediction:', err)
      setError('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleScoreChange = (value: string, setter: (value: string) => void) => {
    const num = value === '' ? '' : Math.min(Math.max(parseInt(value) || 0, MIN_SCORE), MAX_SCORE).toString()
    setter(num)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {!isPredictionAllowed && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600 text-sm text-center">
            ไม่สามารถทายผลได้ เนื่องจากต้องทำนายก่อนเวลา {closingTime}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <label className="block flex-1">
          <span className="text-gray-700 text-sm mb-1 block text-center">{teamNames.teamA}</span>
          <input
            type="number"
            min="0"
            max="99"
            required
            value={scoreA}
            onChange={(e) => handleScoreChange(e.target.value, setScoreA)}
            className="w-full h-12 text-center text-xl font-bold rounded-lg border border-gray-200 bg-white text-black placeholder-gray-400"
          />
        </label>
        <span className="font-bold text-gray-700 text-lg">VS</span>
        <label className="block flex-1">
          <span className="text-gray-700 text-sm mb-1 block text-center">{teamNames.teamB}</span>
          <input
            type="number"
            min="0"
            max="99"
            required
            value={scoreB}
            onChange={(e) => handleScoreChange(e.target.value, setScoreB)}
            className="w-full h-12 text-center text-xl font-bold rounded-lg border border-gray-200 bg-white text-black placeholder-gray-400"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-gray-700 text-sm mb-1 block">เบอร์โทรศัพท์</span>
        <input
          type="tel"
          required
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full h-12 px-3 rounded-lg border border-gray-200 bg-white text-black text-base placeholder-gray-400"
        />
      </label>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}

      <button 
        type="submit"
        disabled={isSubmitting || !isPredictionAllowed}
        className="h-12 mt-2 bg-blue-600 text-white rounded-lg text-base font-medium 
                 disabled:bg-gray-400 disabled:cursor-not-allowed active:bg-blue-700"
      >
        {isSubmitting 
          ? 'กำลังบันทึก...' 
          : !isPredictionAllowed 
            ? 'หมดเวลาทำนายผล'
            : 'ยืนยันการทาย'
        }
      </button>
    </form>
  )
}
