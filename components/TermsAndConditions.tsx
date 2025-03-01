'use client'

import { useState, useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

interface TermsAndConditionsProps {
  date?: Date | string | null
}

// Helper function to convert Thai date string to ISO format
const convertThaiDateToDate = (thaiDate: string): Date | null => {
  try {
    if (!thaiDate) return null;
    
    const thaiMonths: { [key: string]: string } = {
      'มกราคม': '01', 'กุมภาพันธ์': '02', 'มีนาคม': '03', 'เมษายน': '04',
      'พฤษภาคม': '05', 'มิถุนายน': '06', 'กรกฎาคม': '07', 'สิงหาคม': '08',
      'กันยายน': '09', 'ตุลาคม': '10', 'พฤศจิกายน': '11', 'ธันวาคม': '12'
    }

    // If it's an ISO string or any valid date string
    if (!isNaN(Date.parse(thaiDate))) {
      return new Date(thaiDate);
    }
    
    // Check if it's in Thai format (e.g. "1 มีนาคม 2568")
    const parts = thaiDate.split(' ');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = thaiMonths[parts[1]];
      const year = parseInt(parts[2]) - 543; // Convert Buddhist year to Gregorian

      if (month && !isNaN(year)) {
        return new Date(`${year}-${month}-${day}`);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
}

export default function TermsAndConditions({ date }: TermsAndConditionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Default date and time values
  const defaultDate = '1 มีนาคม 2568';
  const defaultTime = '14.00';
  
  // Convert date if provided, or use default
  let dateObj: Date | null = null;
  
  if (date) {
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string') {
      dateObj = convertThaiDateToDate(date);
    }
  }
  
  // Format the date or use default if conversion failed
  const formattedDate = dateObj ? format(dateObj, 'd MMMM yyyy', { locale: th }) : defaultDate;
  const formattedTime = dateObj ? format(dateObj, 'HH.mm', { locale: th }) : defaultTime;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000); // Changed from 500ms to 1000ms for smoother transition
    
    return () => clearTimeout(timer);
  }, []);

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
            <li>สมาชิกต้องมียอดแทงหวยไทย 1,000 บาทขึ้นไป ภายในวันที่ {formattedDate}</li>
            <li>1 User ทายผลได้เพียง 1 ครั้ง เท่านั้น (หากมีคำตอบมากกว่า 1 ยึดคำตอบแรกเท่านั้น)</li>
            <li>หมดเวลาร่วมสนุก {formattedDate} เวลา {formattedTime} น.</li>
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
