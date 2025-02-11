import { NextResponse } from 'next/server'
import { PredictionData } from '@/lib/types'
import { PHONE_REGEX } from '@/lib/constants'

export async function POST(request: Request) {
  try {
    const prediction: PredictionData = await request.json()
    const { match_id, team_a, team_b, score_a, score_b, phone_number, submission_time } = prediction

    // Validation
    if (!match_id) {
      return NextResponse.json(
        { error: 'รหัสการแข่งขันไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    if (!phone_number.match(PHONE_REGEX)) {
      return NextResponse.json(
        { error: 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง' },
        { status: 400 }
      )
    }

    if (score_a < 0 || score_b < 0 || score_a > 99 || score_b > 99) {
      return NextResponse.json(
        { error: 'สกอร์ต้องอยู่ระหว่าง 0-99' },
        { status: 400 }
      )
    }

    // Generate prediction ID (ในระบบจริงควรสร้างจาก database)
    const predictionId = `PRED-${Date.now()}`

    // Log prediction (replace with DB operation in production)
    console.log('Prediction saved:', {
      predictionId,
      match_id,
      team_a,
      team_b,
      score_a,
      score_b,
      phone_number,
      submission_time
    })

    return NextResponse.json({ 
      data: {
        success: true,
        message: 'บันทึกการทายผลสำเร็จ',
        predictionId
      }
    })

  } catch (error) {
    console.error('Error processing prediction:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
