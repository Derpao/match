'use client'

import { useState } from 'react'
import { ChevronUpIcon } from '@heroicons/react/24/solid'

export default function TermsAndConditions() {
  const [isOpen, setIsOpen] = useState(true) // Default to open

  return (
    <div className="mt-8">
      <div className="rounded-lg border border-gray-200 bg-white">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h3 className="text-lg font-medium text-blue-600">
            เงื่อนไขเข้าร่วมกิจกรรม
          </h3>
          <ChevronUpIcon 
            className={`w-5 h-5 text-blue-600 transition-transform duration-300 ease-in-out
              ${isOpen ? '' : 'transform rotate-180'}`}
          />
        </button>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden
            ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="p-4 text-sm text-gray-600 border-t border-gray-200">
            <div className="space-y-4">
              <p className="font-medium text-blue-500 rounded-lg bg-blue-50 p-3">
                พิเศษ สำหรับสมาชิกที่มียอดเดิมพันฟุตบอลย้อนหลัง 7 วัน ขึ้นไป รับรางวัลX2 (รับได้ 1คู่เท่านั้น)
              </p>

              <ul className="space-y-3 list-none">
                {[
                  {
                    main: 'สมาชิกต้องมียอดเล่นฟุตบอลขั้นต่ำ 1,000 ของวันที่บอลเตะ หรือก่อนหน้านั้น 1 วัน',
                    sub: '**ยกเว้นค่าย SBOBET, AFB88',
                    note: '(นับเฉพาะยอดเล่นฟุตบอล นับยอดเล่นกิจกรรมตั้งแต่ 10.00 - 23.59 น.)'
                  },
                  'หากเดิมพันบิลได้ครึ่ง-เสียครึ่ง นับเล่นครึ่งเดียว',
                  'ผลการแข่งขันนับเฉพาะ 90 นาทีในเวลาเท่านั้น',
                  '1 User ทายผลได้เพียง 1 ครั้ง เท่านั้น (หากมีคำตอบมากกว่า 1 ยึดคำตอบแรกเท่านั้น)',
                  'หมดเวลาร่วมสนุกก่อน 2 ชม. บอลเตะ',
                  'การตัดสินของทีมงานถือเป็นที่สิ้นสุด',
                  'ผู้ที่ได้รับรางวัลต้องมียอดฝากขั้นต่ำ 1,000 บาทในวันที่ทายผล',
                  {
                    main: 'รางวัลหารตามจำนวนคนที่ตอบถูก',
                    sub: '',
                    note: ''
                  }
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <div>
                      {typeof item === 'string' ? (
                        <p>{item}</p>
                      ) : (
                        <div className="space-y-1">
                            <p className="text-red-500 font-bold">{item.main}</p>
                          {item.sub && <p className="text-red-500">{item.sub}</p>}
                          {item.note && <p className="text-gray-500 text-sm">{item.note}</p>}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
