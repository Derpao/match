'use client'

import { useState, useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'

export default function TermsAndConditions() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 1000) // Changed from 500ms to 1000ms for smoother transition

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full mt-4">
      <button
        className="w-full flex justify-between items-center p-4 bg-[#2D3D99] hover:bg-[#2D3D99]/90 text-white rounded-lg transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">เงื่อนไขการเข้าร่วมกิจกรรม</span>
        <ChevronDownIcon 
          className={`w-5 h-5 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-4 bg-white border border-gray-200 rounded-b-lg">
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>สมาชิกต้องมียอดแทงหวยไทย 1,000 บาทขึ้นไป ภายในวันที่ 1 มีนาคม 2568</li>
            <li>1 User ทายผลได้เพียง 1 ครั้ง เท่านั้น (หากมีคำตอบมากกว่า 1 ยึดคำตอบแรกเท่านั้น)</li>
            <li>หมดเวลาร่วมสนุก 1 มีนาคม 2568 เวลา 14.00 น.</li>
            <li>สมาชิกที่ทายถูกต้องรายงานตัวภายใน 24 ชั่วโมง หลังจากทายถูก (มิเช่นนั้นถือว่าสละสิทธิ์)</li>
            <li className="text-red-600 font-medium">
              รางวัลจะถูกหารตามจำนวนคนที่ทายถูกทั้งหมด
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
